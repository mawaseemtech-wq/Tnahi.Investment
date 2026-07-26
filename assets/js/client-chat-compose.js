/* مكوّن الإرسال المشترك: مرفقات · صوت · نماذج */
const ClientChatCompose = {
  pending: {},
  mediaRecorder: null,
  chunks: [],
  recording: false,

  bind(root, { prefix, onSend, onForm, showFormBtn }) {
    if (!root) return;
    this.pending[prefix] = [];
    const fileIn = root.querySelector("[data-file]");
    const imgIn = root.querySelector("[data-image]");
    const voiceBtn = root.querySelector("[data-voice]");
    const formBtn = root.querySelector("[data-form-btn]");
    const sendBtn = root.querySelector("[data-send]");
    const textEl = root.querySelector("[data-text]");
    const status = root.querySelector("[data-voice-status]");

    if (formBtn) formBtn.hidden = !showFormBtn;

    const addAtt = async (file) => {
      try {
        const att = await ClientBridge.fileToAttachment(file);
        this.pending[prefix].push(att);
        this._renderPending(root, prefix);
      } catch (e) {
        alert(e.message || "تعذر إرفاق الملف");
      }
    };

    fileIn?.addEventListener("change", () => {
      if (fileIn.files[0]) addAtt(fileIn.files[0]);
      fileIn.value = "";
    });
    imgIn?.addEventListener("change", () => {
      if (imgIn.files[0]) addAtt(imgIn.files[0]);
      imgIn.value = "";
    });

    voiceBtn?.addEventListener("click", async () => {
      if (this.recording) {
        this.mediaRecorder?.stop();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.chunks = [];
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size) this.chunks.push(e.data);
        };
        this.mediaRecorder.onstop = async () => {
          this.recording = false;
          stream.getTracks().forEach((t) => t.stop());
          if (status) {
            status.hidden = true;
            status.textContent = "";
          }
          voiceBtn.classList.remove("recording");
          const blob = new Blob(this.chunks, { type: "audio/webm" });
          if (blob.size > ClientBridge.MAX_FILE_BYTES) {
            alert("التسجيل طويل جداً");
            return;
          }
          const file = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
          await addAtt(file);
        };
        this.mediaRecorder.start();
        this.recording = true;
        voiceBtn.classList.add("recording");
        if (status) {
          status.hidden = false;
          status.textContent = "جاري التسجيل… اضغط الميكروفون للإيقاف";
        }
      } catch (_) {
        alert("تعذر الوصول للميكروفون");
      }
    });

    formBtn?.addEventListener("click", () => onForm?.());

    const doSend = () => {
      const text = textEl?.value?.trim() || "";
      const atts = [...(this.pending[prefix] || [])];
      if (!text && !atts.length) return;
      onSend?.({ text, attachments: atts });
      if (textEl) textEl.value = "";
      this.pending[prefix] = [];
      this._renderPending(root, prefix);
    };

    sendBtn?.addEventListener("click", doSend);
    textEl?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        doSend();
      }
    });
  },

  _renderPending(root, prefix) {
    const box = root.querySelector("[data-pending]");
    if (!box) return;
    const list = this.pending[prefix] || [];
    box.innerHTML = list
      .map(
        (a, i) => `
      <span class="psr-pending-chip">
        ${a.kind === "image" ? "🖼" : a.kind === "audio" ? "🎤" : "📎"} ${a.name}
        <button type="button" data-rm="${i}">×</button>
      </span>`
      )
      .join("");
    box.querySelectorAll("[data-rm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.pending[prefix].splice(Number(btn.dataset.rm), 1);
        this._renderPending(root, prefix);
      });
    });
  },

  bindFormSubmit(container, threadId, onDone) {
    container?.querySelectorAll("form.psr-form.pending").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const msgId = form.getAttribute("data-form-msg");
        const data = {};
        form.querySelectorAll("[name]").forEach((el) => {
          data[el.name] = el.value;
        });
        ClientBridge.submitForm(threadId, msgId, data);
        onDone?.();
      });
    });
    container?.querySelectorAll("[data-pick-form]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const msgId = btn.getAttribute("data-form-msg");
        const optId = btn.getAttribute("data-pick-form");
        ClientBridge.selectFormOption(threadId, msgId, optId);
        onDone?.();
      });
    });
  },
};

if (typeof window !== "undefined") window.ClientChatCompose = ClientChatCompose;

/** ربط أحداث التواصل والإشعارات (بوابة العميل + المنصة الرقمية) */
const ClientMessages = {
  RELATED_MAP: {
    عام: { kind: "general", ref: "", label: "عام" },
    "مشروع: متحف حي الثقافة": { kind: "project", ref: "P-101", label: "متحف حي الثقافة" },
    "مشروع: متحف وبلاد الصافية": { kind: "project", ref: "P-102", label: "متحف وبلاد الصافية" },
    "عقد الحراسة": { kind: "contract", ref: "CT-DEMO", label: "عقد الحراسة 2026" },
    "عرض سعر": { kind: "quote", ref: "Q-1", label: "عرض سعر" },
  },

  bind({ refresh, toast, promptForm, onBadge, side = "client" } = {}) {
    if (typeof ClientBridge === "undefined") return;
    ClientBridge.seedIfEmpty();
    onBadge?.();

    const isAdmin = side === "admin";
    const who = isAdmin
      ? "سنام للحراسات الأمنية"
      : `عميل — ${AppData.client?.name || "تناهي للاستثمار"}`;
    const from = isAdmin ? "admin" : "client";

    const closeClientDds = () => {
      sessionStorage.setItem("client_list_dd", "0");
      sessionStorage.setItem("client_chat_dd", "0");
    };

    document.getElementById("client-list-dd-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = sessionStorage.getItem("client_list_dd") === "1";
      sessionStorage.setItem("client_chat_dd", "0");
      sessionStorage.setItem("client_list_dd", open ? "0" : "1");
      refresh?.();
    });
    document.getElementById("client-chat-dd-btn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = sessionStorage.getItem("client_chat_dd") === "1";
      sessionStorage.setItem("client_list_dd", "0");
      sessionStorage.setItem("client_chat_dd", open ? "0" : "1");
      refresh?.();
    });
    document.getElementById("client-list-clear")?.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionStorage.setItem("client_thread_q", "");
      sessionStorage.setItem("client_thread_kind", "");
      sessionStorage.setItem("client_thread_sort", "newest");
      refresh?.();
    });
    document.getElementById("client-chat-clear")?.addEventListener("click", (e) => {
      e.stopPropagation();
      sessionStorage.setItem("client_chat_q", "");
      sessionStorage.setItem("client_chat_kind", "");
      refresh?.();
    });

    document.querySelectorAll(".cn-dd-menu").forEach((menu) => {
      menu.addEventListener("click", (e) => e.stopPropagation());
    });

    let searchTimer;
    document.getElementById("client-thread-search")?.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        sessionStorage.setItem("client_thread_q", e.target.value || "");
        sessionStorage.setItem("client_list_dd", "1");
        refresh?.();
      }, 120);
    });
    document.getElementById("client-thread-sort")?.addEventListener("change", (e) => {
      sessionStorage.setItem("client_thread_sort", e.target.value || "newest");
      sessionStorage.setItem("client_list_dd", "1");
      refresh?.();
    });
    document.querySelectorAll("#client-kind-chips [data-client-kind]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sessionStorage.setItem("client_thread_kind", btn.getAttribute("data-client-kind") || "");
        sessionStorage.setItem("client_list_dd", "1");
        refresh?.();
      });
    });

    let chatTimer;
    document.getElementById("client-chat-search")?.addEventListener("input", (e) => {
      clearTimeout(chatTimer);
      chatTimer = setTimeout(() => {
        sessionStorage.setItem("client_chat_q", e.target.value || "");
        sessionStorage.setItem("client_chat_dd", "1");
        refresh?.();
      }, 120);
    });
    document.querySelectorAll("#client-chat-chips [data-client-kind]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sessionStorage.setItem("client_chat_kind", btn.getAttribute("data-client-kind") || "");
        sessionStorage.setItem("client_chat_dd", "1");
        refresh?.();
      });
    });

    document.querySelectorAll("[data-thread]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-thread");
        sessionStorage.setItem("client_thread_id", id);
        sessionStorage.setItem("client_chat_q", "");
        sessionStorage.setItem("client_chat_kind", "");
        closeClientDds();
        ClientBridge.markRead(id, side);
        refresh?.();
        onBadge?.();
      });
    });

    document.getElementById("client-close-thread")?.addEventListener("click", () => {
      const id = sessionStorage.getItem("client_thread_id");
      if (!id) return;
      ClientBridge.closeThread(id);
      refresh?.();
      toast?.("تم إغلاق المحادثة");
      onBadge?.();
    });

    document.getElementById("client-new-thread")?.addEventListener("click", () => {
      const relatedOpts = Object.keys(this.RELATED_MAP);
      const catalog = ClientBridge.getFormCatalog();
      const formOpts = ["بدون نموذج", ...catalog.map((t) => t.title), "حزمة نماذج (اختيار)"];

      promptForm?.({
        title: isAdmin ? "رسالة / نموذج للعميل" : "رسالة جديدة للإدارة",
        fields: [
          { name: "subject", label: "الموضوع", required: true },
          {
            name: "related",
            label: "الربط",
            type: "select",
            options: relatedOpts,
          },
          ...(isAdmin
            ? [{ name: "formTpl", label: "إرفاق نموذج", type: "select", options: formOpts }]
            : []),
          { name: "text", label: "نص الرسالة", type: "textarea", required: true },
        ],
        onSubmit: (data) => {
          let form = null;
          if (isAdmin && data.formTpl && data.formTpl !== "بدون نموذج") {
            if (data.formTpl === "حزمة نماذج (اختيار)") {
              form = ClientBridge.buildChoiceForm(catalog.slice(0, 4), "اختر نموذجاً للتعبئة");
            } else {
              const tpl = catalog.find((t) => t.title === data.formTpl);
              form = ClientBridge.cloneFormFromTemplate(tpl || "tpl-followup");
            }
          }
          const t = ClientBridge.createThread({
            subject: data.subject,
            type: form ? "request" : "message",
            relatedTo: this.RELATED_MAP[data.related] || this.RELATED_MAP["عام"],
            firstMessage: data.text,
            from,
            who,
            clientName: AppData.client?.name || "تناهي للاستثمار",
            form,
          });
          sessionStorage.setItem("client_thread_id", t.id);
          ClientBridge.markRead(t.id, side);
          refresh?.();
          toast?.(isAdmin ? "تم إرسال الرسالة للعميل" : "تم إرسال الرسالة للإدارة");
          onBadge?.();
        },
      });
    });

    const id =
      sessionStorage.getItem("client_thread_id") ||
      ClientBridge.getThreads(ClientBridge.CLIENT_ID)[0]?.id;

    const compose = document.querySelector(`[data-compose="${side}"]`);
    if (compose && id && typeof ClientChatCompose !== "undefined") {
      ClientChatCompose.bind(compose, {
        prefix: side,
        showFormBtn: isAdmin,
        onForm: () => {
          const catalog = ClientBridge.getFormCatalog();
          promptForm?.({
            title: "إرسال نموذج للعميل",
            fields: [
              {
                name: "formTpl",
                label: "النموذج",
                type: "select",
                options: [...catalog.map((t) => t.title), "حزمة نماذج (اختيار)"],
              },
              { name: "note", label: "ملاحظة مرفقة", type: "textarea" },
            ],
            onSubmit: (data) => {
              let form;
              if (data.formTpl === "حزمة نماذج (اختيار)") {
                form = ClientBridge.buildChoiceForm(catalog.slice(0, 4), "اختر نموذجاً للتعبئة");
              } else {
                const tpl = catalog.find((t) => t.title === data.formTpl);
                form = ClientBridge.cloneFormFromTemplate(tpl || "tpl-followup");
              }
              ClientBridge.reply(id, {
                from: "admin",
                who: "سنام للحراسات الأمنية",
                text: data.note || `يرجى تعبئة النموذج: ${form.title}`,
                kind: "form",
                form,
              });
              sessionStorage.setItem("client_thread_id", id);
              refresh?.();
              toast?.("تم إرسال النموذج للعميل");
              onBadge?.();
            },
          });
        },
        onSend: ({ text, attachments }) => {
          ClientBridge.reply(id, {
            from,
            who,
            text,
            attachments,
            kind: "chat",
          });
          sessionStorage.setItem("client_thread_id", id);
          refresh?.();
          toast?.("تم الإرسال");
          onBadge?.();
        },
      });
    }

    const chatBox = document.getElementById("chat-box");
    if (chatBox && id && typeof ClientChatCompose !== "undefined") {
      ClientChatCompose.bindFormSubmit(chatBox, id, () => {
        refresh?.();
        toast?.("تم إرسال النموذج");
        onBadge?.();
      });
      chatBox.querySelectorAll("form.psr-form.pending").forEach((f) => {
        f.setAttribute("data-form-thread", id);
      });
      const chatQ = sessionStorage.getItem("client_chat_q");
      const chatKind = sessionStorage.getItem("client_chat_kind");
      if (!chatQ && !chatKind) chatBox.scrollTop = chatBox.scrollHeight;
    }

    if (id) {
      ClientBridge.markRead(id, side);
      onBadge?.();
    }
  },
};

if (typeof window !== "undefined") window.ClientMessages = ClientMessages;
