const DigitalApp = {
  user: null,

  init() {
    this.bindLogin();
    this.bindHeader();
    this.bindAssistant();

    if (sessionStorage.getItem("digital_logged_in") === "1") {
      this.enterApp();
    }
  },

  bindHeader() {
    document.getElementById("logout-btn")?.addEventListener("click", () => {
      sessionStorage.removeItem("digital_logged_in");
      document.getElementById("app").classList.add("hidden");
      document.getElementById("login-screen").classList.remove("hidden");
      this.closeAssistant();
      this.toast("تم تسجيل الخروج");
    });

    const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const tickHeader = () => {
      const now = new Date();
      const dateEl = document.getElementById("header-date");
      const timeEl = document.getElementById("header-time");
      if (dateEl) {
        dateEl.textContent = `${weekdays[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
      }
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      }
    };
    tickHeader();
    setInterval(tickHeader, 30000);
  },

  bindLogin() {
    document.getElementById("login-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      if (email === AppData.client.email && password === AppData.client.password) {
        sessionStorage.setItem("digital_logged_in", "1");
        this.enterApp();
        this.toast("مرحبًا بك في منصة التحول الرقمي");
      } else {
        this.toast("بيانات الدخول غير صحيحة");
      }
    });
    this.bindLoginExtras();
  },

  bindLoginExtras() {
    const eye = document.getElementById("login-toggle-pass");
    const pass = document.getElementById("login-password");
    eye?.addEventListener("click", () => {
      if (!pass) return;
      const show = pass.type === "password";
      pass.type = show ? "text" : "password";
      const ico = eye.querySelector("i");
      if (ico) ico.className = show ? "bi bi-eye-slash" : "bi bi-eye";
      eye.setAttribute("aria-label", show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
    });

    const sites = {
      thaqafa: "مكة المكرمة · حي حراء الثقافي",
      safiyah: "المدينة المنورة · متحف وبلاد الصافية",
    };
    document.querySelectorAll("[data-login-site]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-login-site]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const id = btn.dataset.loginSite;
        sessionStorage.setItem("login_focus_site", id);
        this.loginSiteToast(sites[id] || "موقع تناهي");
      });
    });
  },

  loginSiteToast(msg) {
    document.querySelector(".login-site-toast")?.remove();
    const el = document.createElement("div");
    el.className = "login-site-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  },

  setUser() {
    this.user = AppData.users?.[0] || {
      name: "مستخدم تناهي",
      role: "مدير المشروع",
      email: AppData.client.email,
    };
    const nameEl = document.getElementById("user-name");
    const roleEl = document.getElementById("user-role");
    const avatar = document.querySelector(".dpt-user-avatar");
    if (nameEl) nameEl.textContent = this.user.name;
    if (roleEl) roleEl.textContent = `${this.user.role} · ${AppData.client.name}`;
    if (avatar) avatar.textContent = this.user.name.trim().charAt(0);
  },

  enterApp() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    this.setUser();
    if (typeof ClientBridge !== "undefined") {
      ClientBridge.seedIfEmpty();
      if (!this._msgSyncBound) {
        this._msgSyncBound = true;
        ClientBridge.subscribe((source) => {
          this.updateMessageBadge();
          if (source === "storage" && (sessionStorage.getItem("digital_panel") || "home") === "messages") {
            this.refreshMessages();
          }
        });
      }
    }
    this.render();
    this.updateMessageBadge();
  },

  render() {
    const content = document.getElementById("content");
    content.innerHTML = Views.digital();
    this.bindDigital();
    this.bindGoLinks();
  },

  navigate(view) {
    const map = {
      reports: "alerts",
      dashboard: "home",
      attendance: "attendance",
      evaluations: "staff",
      digital: "home",
      users: "users",
    };
    this.showPanel(map[view] || view);
  },

  showPanel(id) {
    const prev = document.querySelector(".platform-panel.active");
    const next = document.querySelector(`.platform-panel[data-platform-panel="${id}"]`);
    if (!next || prev === next) {
      this.syncNav(id);
      if (id === "messages") this.bindMessages();
      if (id === "users") this.bindUsers();
      if (id === "alerts") this.bindAlerts();
      return;
    }

    sessionStorage.setItem("digital_panel", id);
    this.syncNav(id);

    if (prev) {
      prev.classList.add("is-leaving");
      prev.classList.remove("active");
      setTimeout(() => prev.classList.remove("is-leaving"), 280);
    }

    next.classList.add("active");
    document.querySelector(".platform-main")?.scrollTo({ top: 0, behavior: "smooth" });

    if (id === "home") setTimeout(() => this.initDigitalMap(), 40);
    if (id === "mobile") setTimeout(() => MobileSim.bind(), 30);
    if (id === "messages") setTimeout(() => this.bindMessages(), 20);
    if (id === "users") setTimeout(() => this.bindUsers(), 20);
    if (id === "alerts") setTimeout(() => this.bindAlerts(), 20);
  },

  syncNav(id) {
    document.querySelectorAll("#platform-nav .platform-nav-item").forEach((b) => {
      b.classList.toggle("active", b.dataset.platformPanel === id);
    });
    document.querySelectorAll("#platform-nav .nav-section").forEach((g) => {
      const hasActive = !!g.querySelector(`.platform-nav-item[data-platform-panel="${id}"]`);
      g.classList.toggle("has-active", hasActive);
    });
  },

  bindGoLinks() {
    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => this.navigate(btn.dataset.go));
    });
  },

  bindDigital() {
    document.querySelectorAll("#platform-nav .platform-nav-item, .platform-goto").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.platformPanel;
        if (!id) return;
        this.showPanel(id);
      });
    });

    const current = sessionStorage.getItem("digital_panel") || "home";
    this.syncNav(current);
    if (current === "home") this.initDigitalMap();
    if (current === "mobile") setTimeout(() => MobileSim.bind(), 30);
    if (current === "messages") setTimeout(() => this.bindMessages(), 20);
    if (current === "users") setTimeout(() => this.bindUsers(), 20);
    if (current === "alerts") setTimeout(() => this.bindAlerts(), 20);
  },

  bindMessages() {
    if (typeof ClientMessages === "undefined") return;
    ClientMessages.bind({
      side: "admin",
      refresh: () => this.refreshMessages(),
      toast: (m) => this.toast(m),
      promptForm: (opts) => this.promptForm(opts),
      onBadge: () => this.updateMessageBadge(),
    });
  },

  refreshMessages() {
    sessionStorage.setItem("digital_panel", "messages");
    const panel = document.querySelector('.platform-panel[data-platform-panel="messages"] .plat-section');
    if (!panel) {
      this.render();
      return;
    }
    panel.innerHTML = `
      <div class="plat-section-head">
        <h3>التواصل والإشعارات</h3>
        <p>غرفة سنام مع عميل تناهي — إرسال وردود ونماذج، مرتبطة مباشرة ببوابة العميل</p>
      </div>
      ${Views.messagesInner("admin")}
    `;
    this.bindMessages();
    this.updateMessageBadge();
  },

  updateMessageBadge() {
    if (typeof ClientBridge === "undefined") return;
    ClientBridge.seedIfEmpty();
    const n = ClientBridge.unreadForAdmin();
    const el = document.getElementById("digitalMsgBadge");
    if (!el) return;
    if (n > 0) {
      el.hidden = false;
      el.textContent = String(n);
    } else {
      el.hidden = true;
    }
  },

  bindUsers() {
    document.getElementById("add-user")?.addEventListener("click", () => {
      this.promptForm({
        title: "إضافة مستخدم عميل",
        fields: [
          { name: "name", label: "اسم العميل", required: true },
          { name: "email", label: "البريد الإلكتروني", required: true },
          { name: "password", label: "كلمة المرور", required: true },
          { name: "role", label: "الدور", type: "select", options: ["مدير المشروع", "مراقب حضور", "مشرف مركبات", "مطلع فقط"] },
        ],
        onSubmit: (data) => {
          AppData.users.push({ id: Date.now(), ...data });
          this.refreshUsers();
          this.toast("تمت إضافة المستخدم");
        },
      });
    });

    document.querySelectorAll(".del-user").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppData.users.splice(Number(btn.dataset.index), 1);
        this.refreshUsers();
        this.toast("تم حذف المستخدم");
      });
    });

    document.getElementById("client-account-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Object.assign(AppData.client, Object.fromEntries(fd.entries()));
      this.setUser();
      this.toast("تم حفظ بيانات حساب العميل");
    });
  },

  refreshUsers() {
    sessionStorage.setItem("digital_panel", "users");
    const panel = document.querySelector('.platform-panel[data-platform-panel="users"] .plat-section');
    if (!panel) {
      this.render();
      return;
    }
    panel.innerHTML = `
      <div class="plat-section-head">
        <h3>مستخدمو العميل</h3>
        <p>إدارة حسابات الدخول لبوابة العميل ومنصة التحول الرقمي</p>
      </div>
      ${Views.usersInner()}
    `;
    this.bindUsers();
  },

  bindAlerts() {
    this.bindPanelTabs();

    const applyFilters = () => {
      const site = document.getElementById("alert-site")?.value || "all";
      const level = document.getElementById("alert-level")?.value || "all";
      const status = document.getElementById("alert-status")?.value || "all";
      document.querySelectorAll("#alerts-body tr").forEach((row) => {
        const okSite = site === "all" || row.dataset.site === site;
        const okLevel = level === "all" || row.dataset.level === level;
        const okStatus = status === "all" || row.dataset.status === status;
        row.style.display = okSite && okLevel && okStatus ? "" : "none";
      });
    };

    ["alert-site", "alert-level", "alert-status"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", applyFilters);
    });

    document.querySelectorAll(".alert-advance").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const alert = AppData.fieldAlerts.find((a) => a.id === id);
        if (!alert) return;
        if (alert.status === "مفتوح") alert.status = "قيد المعالجة";
        else if (alert.status === "قيد المعالجة") alert.status = "مغلق";
        this.refreshAlerts();
        this.toast(alert.status === "مغلق" ? "تم إغلاق البلاغ" : "تم بدء معالجة البلاغ");
      });
    });

    document.getElementById("add-alert")?.addEventListener("click", () => {
      this.promptForm({
        title: "تسجيل بلاغ جديد",
        fields: [
          { name: "project", label: "الموقع", type: "select", options: AppData.projects.map((p) => p.name), required: true },
          { name: "type", label: "النوع", type: "select", options: ["أمني", "تشغيلي", "ميداني", "صيانة", "طوارئ"] },
          { name: "level", label: "المستوى", type: "select", options: ["عالٍ", "متوسط", "منخفض"] },
          { name: "text", label: "وصف البلاغ", required: true },
          { name: "handler", label: "المسؤول", value: "مشرف الموقع" },
        ],
        onSubmit: (data) => {
          const now = new Date();
          AppData.fieldAlerts.unshift({
            id: Date.now(),
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
            date: now.toISOString().slice(0, 10),
            status: "مفتوح",
            ...data,
          });
          this.refreshAlerts();
          this.toast("تم تسجيل البلاغ");
        },
      });
    });

    document.getElementById("issue-daily")?.addEventListener("click", () => {
      AppData.dailyReports.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        project: AppData.projects[0].name,
        summary: "تقرير يومي صادر من المنصة — الوضع العام مستقر",
        author: "عميل البوابة",
      });
      this.refreshAlerts();
      this.toast("تم إصدار التقرير اليومي");
    });
  },

  refreshAlerts() {
    sessionStorage.setItem("digital_panel", "alerts");
    const panel = document.querySelector('.platform-panel[data-platform-panel="alerts"] .plat-section');
    if (!panel) {
      this.render();
      return;
    }
    panel.innerHTML = `
      <div class="plat-section-head">
        <h3>البلاغات والحوادث</h3>
        <p>لوحة متابعة البلاغات لمواقع تناهي للاستثمار — حي الثقافة وبلاد الصافية</p>
      </div>
      ${Views.reportsInner()}
    `;
    this.bindAlerts();
  },

  bindPanelTabs() {
    document.querySelectorAll("[data-tabs]").forEach((tabs) => {
      if (tabs.dataset.bound === "1") return;
      tabs.dataset.bound = "1";
      tabs.addEventListener("click", (e) => {
        const tab = e.target.closest(".tab");
        if (!tab) return;
        const root = tabs.parentElement;
        tabs.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === tab));
        root.querySelectorAll(".tab-panel").forEach((p) => {
          p.classList.toggle("active", p.dataset.panel === tab.dataset.tab);
        });
      });
    });
  },

  promptForm({ title, fields, onSubmit }) {
    const host = document.getElementById("modal-host");
    if (!host) return;
    const fieldsHtml = fields.map((f) => {
      if (f.type === "select") {
        return `
          <label class="field">
            <span>${f.label}</span>
            <select name="${f.name}">
              ${f.options.map((o) => `<option value="${o}">${o}</option>`).join("")}
            </select>
          </label>
        `;
      }
      if (f.type === "textarea") {
        return `
          <label class="field full">
            <span>${f.label}</span>
            <textarea name="${f.name}" rows="3" ${f.required ? "required" : ""}>${f.value || ""}</textarea>
          </label>
        `;
      }
      return `
        <label class="field">
          <span>${f.label}</span>
          <input name="${f.name}" value="${f.value || ""}" ${f.required ? "required" : ""} />
        </label>
      `;
    }).join("");

    host.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <form id="modal-form" class="form-grid" style="grid-template-columns:1fr">${fieldsHtml}
          <div class="modal-actions full">
            <button type="button" class="btn btn-secondary" id="modal-cancel">إلغاء</button>
            <button type="submit" class="btn btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    `;

    const close = () => { host.innerHTML = ""; };
    document.getElementById("modal-cancel").addEventListener("click", close);
    host.addEventListener("click", (e) => { if (e.target === host) close(); }, { once: true });
    document.getElementById("modal-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      close();
      onSubmit(data);
    });
  },

  /* ===== AI Assistant ===== */
  openAssistant() {
    const panel = document.getElementById("ai-panel");
    const tab = document.getElementById("ai-tab");
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    tab?.classList.add("is-open");
    tab?.setAttribute("aria-expanded", "true");
    if (!panel.dataset.ready) {
      this.aiReset();
      panel.dataset.ready = "1";
    }
    setTimeout(() => document.getElementById("ai-input")?.focus(), 320);
  },

  closeAssistant() {
    const panel = document.getElementById("ai-panel");
    const tab = document.getElementById("ai-tab");
    if (!panel) return;
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    tab?.classList.remove("is-open");
    tab?.setAttribute("aria-expanded", "false");
  },

  bindAssistant() {
    const panel = document.getElementById("ai-panel");

    document.getElementById("ai-tab")?.addEventListener("click", () => this.openAssistant());
    document.getElementById("ai-close")?.addEventListener("click", () => this.closeAssistant());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && panel?.classList.contains("is-open")) this.closeAssistant();
    });

    document.getElementById("ai-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("ai-input");
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      this.aiAsk(q);
    });

    document.querySelectorAll("[data-ai-q]").forEach((btn) => {
      btn.addEventListener("click", () => this.aiAsk(btn.dataset.aiQ));
    });
  },

  aiReset() {
    const chat = document.getElementById("ai-chat");
    if (!chat) return;
    chat.innerHTML = "";
    this.aiBubble(
      "bot",
      `السلام عليكم، أنا مساعدك الشخصي من <b>سنام</b> لتشغيل مواقع <b>تناهي للاستثمار</b> 😊<br><br>الرجاء اختيار إحدى الخيارات المتاحة أو كتابة استفسارك.`
    );

    const quick = document.createElement("div");
    quick.className = "ai-quick-list";
    [
      { label: "قائمة الخدمات", ask: "ما الخدمات المتاحة؟" },
      { label: "مؤشرات الأداء", ask: "مؤشرات الأداء", panel: "kpi" },
      { label: "الحضور اليوم", ask: "ما حالة الحضور اليوم؟", panel: "attendance" },
      { label: "البلاغات", ask: "كم بلاغ مفتوح؟", panel: "alerts" },
      { label: "التواصل", ask: "التواصل والإشعارات", panel: "messages" },
    ].forEach((item) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = item.label;
      b.addEventListener("click", () => {
        if (item.panel) this.showPanel(item.panel);
        this.aiAsk(item.ask);
      });
      quick.appendChild(b);
    });
    chat.appendChild(quick);
  },

  aiBubble(who, html, actions = []) {
    const chat = document.getElementById("ai-chat");
    if (!chat) return;
    chat.querySelector(".ai-quick-list")?.remove();
    const el = document.createElement("div");
    el.className = `ai-bubble ${who}`;
    el.innerHTML = html;
    if (actions.length) {
      const wrap = document.createElement("div");
      wrap.className = "ai-actions";
      actions.forEach((a) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = a.label;
        b.addEventListener("click", () => {
          if (a.panel) this.showPanel(a.panel);
          if (a.ask) this.aiAsk(a.ask);
        });
        wrap.appendChild(b);
      });
      el.appendChild(wrap);
    }
    chat.appendChild(el);
    const scroll = document.querySelector(".ai-panel-scroll");
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
    else chat.scrollTop = chat.scrollHeight;
  },

  aiAsk(question) {
    this.aiBubble("user", this.escape(question));
    const reply = this.aiReply(question);
    setTimeout(() => {
      this.aiBubble("bot", reply.html, reply.actions || []);
    }, 280);
  },

  escape(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  },

  aiReply(q) {
    const text = q.toLowerCase();
    const present = AppData.attendance.filter((a) => a.status === "حاضر").length;
    const absent = AppData.attendance.filter((a) => a.status === "غائب").length;
    const openAlerts = AppData.fieldAlerts.filter((a) => a.status === "مفتوح").length;
    const processing = AppData.fieldAlerts.filter((a) => a.status === "قيد المعالجة").length;
    const closed = AppData.fieldAlerts.filter((a) => a.status === "مغلق").length;

    if (/حضور|انصراف|وردية|موظف/.test(text)) {
      return {
        html: `حالة الحضور الآن لمواقع تناهي:<br>• حاضر: <b>${present}</b><br>• غائب: <b>${absent}</b><br>• نسبة الالتزام التقريبية: <b>98%</b><br><br>المواقع: متحف حي الثقافة · متحف وبلاد الصافية.`,
        actions: [
          { label: "فتح الحضور", panel: "attendance" },
          { label: "أفراد الأمن", panel: "staff" },
        ],
      };
    }

    if (/بلاغ|حادث|تنبيه|مفتوح/.test(text)) {
      return {
        html: `ملخص البلاغات:<br>• مفتوح: <b>${openAlerts}</b><br>• قيد المعالجة: <b>${processing}</b><br>• مغلق: <b>${closed}</b><br>• الإجمالي: <b>${AppData.fieldAlerts.length}</b><br><br>أنصح بمراجعة البلاغات عالية الأولوية أولًا.`,
        actions: [
          { label: "البلاغات", panel: "alerts" },
          { label: "الطوارئ", panel: "emergency" },
        ],
      };
    }

    if (/مؤشر|kpi|أداء|إنجاز|جودة/.test(text)) {
      return {
        html: `أبرز مؤشرات الأداء:<br>• الحضور <b>98%</b> (فوق المستهدف 95%)<br>• تغطية الجولات <b>95%</b><br>• جودة التقارير <b>97%</b><br>• متوسط الاستجابة <b>2.3 دقيقة</b><br>• التقييم العام <b>4.8 / ممتاز</b>`,
        actions: [
          { label: "لوحة KPIs", panel: "kpi" },
          { label: "التقارير", panel: "reports" },
        ],
      };
    }

    if (/خدم|قائمة/.test(text)) {
      return {
        html: `خدمات منصة سنام لـ <b>تناهي للاستثمار</b>:<br>• الحضور الذكي والانصراف<br>• غرفة العمليات والخريطة<br>• الجولات والرقابة الميدانية<br>• إدارة البلاغات والطوارئ<br>• مؤشرات الأداء والتقارير<br>• التواصل والإشعارات<br>• تطبيق الجوال للميدان والعميل`,
        actions: [
          { label: "الرئيسية", panel: "home" },
          { label: "التواصل", panel: "messages" },
          { label: "تطبيق الجوال", panel: "mobile" },
        ],
      };
    }

    if (/موقع|متحف|ثقافة|صافية|خريطة/.test(text)) {
      return {
        html: `مواقع العميل <b>تناهي للاستثمار</b>:<br>1) <b>متحف حي الثقافة</b> — ${AppData.projects[0]?.guards || 64} حارس — حالة نشطة<br>2) <b>متحف وبلاد الصافية</b> — ${AppData.projects[1]?.guards || 64} حارس — حالة نشطة<br><br>يمكنك فتح الخريطة من الرئيسية.`,
        actions: [
          { label: "المواقع", panel: "sites" },
          { label: "الخريطة", panel: "home" },
        ],
      };
    }

    if (/جولة|تفتيش|ميدان/.test(text)) {
      return {
        html: `الجولات الميدانية اليوم:<br>• جولة صباحية في متحف حي الثقافة — <b>مكتملة</b><br>• جولة مسائية في متحف وبلاد الصافية — <b>جارية</b><br>• تغطية الجولات الإجمالية حوالي <b>95%</b>`,
        actions: [{ label: "الجولات", panel: "tours" }],
      };
    }

    if (/طوارئ|إسعاف|استجابة/.test(text)) {
      return {
        html: `جاهزية الطوارئ في الموقعين <b>100%</b>.<br>لا توجد بلاغات طوارئ مفتوحة حاليًا، ومتوسط زمن الاستجابة <b>2.3 دقيقة</b> ضمن الهدف.`,
        actions: [{ label: "إدارة الطوارئ", panel: "emergency" }],
      };
    }

    if (/تطبيق|جوال|موبايل/.test(text)) {
      return {
        html: `تطبيق الجوال جزء من <b>منصة تشغيل أمنية رقمية خاصة بسنام</b>، ويتيح الحضور، الجولات، رفع البلاغات، وتنبيهات الطوارئ للمشرفين والحراس.`,
        actions: [{ label: "تطبيق الجوال", panel: "mobile" }],
      };
    }

    if (/تواصل|إشعار|اشعار|رسال|محادث|مراسل/.test(text)) {
      const n = typeof ClientBridge !== "undefined"
        ? ClientBridge.unreadForClient(ClientBridge.CLIENT_ID)
        : 0;
      return {
        html: `قسم <b>التواصل والإشعارات</b> يتيح مراسلة إدارة سنام مباشرة (نفس بيانات بوابة العميل).<br>• غير مقروء: <b>${n}</b><br>• يمكنك إنشاء رسالة جديدة أو الرد على محادثة قائمة.`,
        actions: [{ label: "فتح التواصل", panel: "messages" }],
      };
    }

    if (/مرحبا|السلام|ساعد|hello|hi/.test(text)) {
      return {
        html: `أهلًا بك. يمكنني شرح الحضور، البلاغات، المؤشرات، أو توجيهك لأي قسم في المنصة.`,
        actions: [
          { label: "الحضور", ask: "ما حالة الحضور اليوم؟" },
          { label: "البلاغات", ask: "كم بلاغ مفتوح؟" },
          { label: "KPIs", ask: "مؤشرات الأداء" },
        ],
      };
    }

    return {
      html: `فهمت سؤالك. جرّب أحد المواضيع التالية أو افتح القسم المناسب من القائمة اليمنى:<br>• الحضور والانصراف<br>• البلاغات والحوادث<br>• مؤشرات الأداء<br>• المواقع والخريطة`,
      actions: [
        { label: "الرئيسية", panel: "home" },
        { label: "المساعد: الحضور", ask: "ما حالة الحضور اليوم؟" },
        { label: "المساعد: KPIs", ask: "مؤشرات الأداء" },
      ],
    };
  },

  initDigitalMap() {
    const mapEl = document.getElementById("digital-ops-map");
    if (!mapEl || typeof L === "undefined") return;
    if (!mapEl.closest(".platform-panel.active")) return;

    if (this._digitalMap) {
      this._digitalMap.remove();
      this._digitalMap = null;
    }

    const sites = [
      { id: "thaqafa", name: "متحف حي الثقافة", lat: 21.4578, lng: 39.8594, guards: 64, present: 58, status: "نشط" },
      { id: "safiyah", name: "متحف وبلاد الصافية", lat: 21.3891, lng: 39.8579, guards: 64, present: 54, status: "نشط" },
    ];

    const map = L.map(mapEl, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
    }).setView([21.4235, 39.858], 12);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const showSite = (site) => {
      const card = document.getElementById("map-site-card");
      if (!card) return;
      document.getElementById("map-site-name").textContent = site.name;
      document.getElementById("map-site-guards").textContent = site.guards;
      document.getElementById("map-site-present").textContent = site.present;
      document.getElementById("map-site-status").textContent = site.status;
      card.hidden = false;
    };

    const markers = sites.map((site, idx) => {
      const icon = L.divIcon({
        className: "tanahi-map-pin",
        html: `<span class="tanahi-pin-dot ${idx === 1 ? "pin-warn" : "pin-ok"}"><i class="bi bi-geo-alt-fill"></i></span>`,
        iconSize: [28, 36],
        iconAnchor: [14, 34],
        popupAnchor: [0, -28],
      });
      const marker = L.marker([site.lat, site.lng], { icon }).addTo(map);
      marker.bindTooltip(site.name, { direction: "top", offset: [0, -28], className: "tanahi-tip" });
      marker.on("click", () => {
        showSite(site);
        map.flyTo([site.lat, site.lng], 15, { duration: 0.7 });
      });
      return marker;
    });

    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.35));

    document.getElementById("map-fit")?.addEventListener("click", () => {
      map.fitBounds(group.getBounds().pad(0.35));
      const card = document.getElementById("map-site-card");
      if (card) card.hidden = true;
    });

    document.getElementById("map-site-close")?.addEventListener("click", () => {
      const card = document.getElementById("map-site-card");
      if (card) card.hidden = true;
    });

    setTimeout(() => map.invalidateSize(), 100);
    this._digitalMap = map;
  },

  toast(msg) {
    const host = document.getElementById("toast-host");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity .3s";
      setTimeout(() => el.remove(), 300);
    }, 2600);
  },
};

document.addEventListener("DOMContentLoaded", () => DigitalApp.init());
