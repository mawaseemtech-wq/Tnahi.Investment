const App = {
  currentView: "dashboard",

  init() {
    this.bindLogin();
    this.bindShell();
    if (sessionStorage.getItem("client_logged_in") === "1") {
      this.enterApp();
    }
  },

  bindLogin() {
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      if (email === AppData.client.email && password === AppData.client.password) {
        sessionStorage.setItem("client_logged_in", "1");
        this.enterApp();
        this.toast("تم الدخول بنجاح");
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

  bindShell() {
    document.getElementById("logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("client_logged_in");
      document.getElementById("app").classList.add("hidden");
      document.getElementById("login-screen").classList.remove("hidden");
      this.toast("تم تسجيل الخروج");
    });

    document.getElementById("menu-toggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });

    document.getElementById("main-nav").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-view]");
      if (!btn) return;
      this.navigate(btn.dataset.view);
      document.getElementById("sidebar").classList.remove("open");
    });
  },

  enterApp() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("sidebar-client-name").textContent = AppData.client.name;
    document.getElementById("user-chip").textContent = AppData.client.name;
    if (typeof ClientBridge !== "undefined") {
      ClientBridge.seedIfEmpty();
      if (!this._msgSyncBound) {
        this._msgSyncBound = true;
        ClientBridge.subscribe((source) => {
          this.updateMessageBadge();
          if (source === "storage" && this.currentView === "messages") {
            this.navigate("messages");
          }
        });
      }
    }
    this.updateMessageBadge();
    this.navigate(this.currentView || "dashboard");
  },

  navigate(view) {
    if (view === "users") {
      sessionStorage.setItem("digital_panel", "users");
      window.location.href = "digital.html";
      return;
    }
    if (view === "reports") {
      sessionStorage.setItem("digital_panel", "alerts");
      window.location.href = "digital.html";
      return;
    }
    if (!Views[view]) return;
    this.currentView = view;

    document.querySelectorAll(".nav-item").forEach((el) => {
      el.classList.toggle("active", el.dataset.view === view);
    });

    const meta = Views.meta[view];
    const pageTitle = document.getElementById("page-title");
    pageTitle.textContent = meta.title;
    pageTitle.classList.toggle("client-gold", view === "dashboard");
    document.getElementById("page-subtitle").textContent = meta.subtitle;

    const content = document.getElementById("content");
    content.innerHTML = Views[view]();
    this.bindViewEvents(view);
    this.updateMessageBadge();
  },

  bindViewEvents(view) {
    document.querySelectorAll("[data-go]").forEach((btn) => {
      btn.addEventListener("click", () => this.navigate(btn.dataset.go));
    });

    document.querySelectorAll("[data-tabs]").forEach((tabs) => {
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

    const handlers = {
      attendance: () => this.bindAttendance(),
      vehicles: () => this.bindVehicles(),
      quote: () => this.bindQuote(),
      contract: () => this.bindContract(),
      approval: () => this.bindApproval(),
      tasks: () => this.bindTasks(),
      letters: () => this.bindLetters(),
      evaluations: () => this.bindEvaluations(),
      messages: () => this.bindMessages(),
      digital: () => this.bindDigital(),
      dashboard: () => this.bindDashboard(),
    };

    if (handlers[view]) handlers[view]();
  },

  bindDashboard() {
    const mapEl = document.getElementById("home-ops-map");
    if (!mapEl || typeof L === "undefined") return;

    if (this._homeMap) {
      this._homeMap.remove();
      this._homeMap = null;
    }

    const sites = [
      { name: "متحف حي الثقافة", lat: 21.4578, lng: 39.8594, tone: "ok" },
      { name: "متحف وبلاد الصافية", lat: 21.3891, lng: 39.8579, tone: "warn" },
    ];

    const map = L.map(mapEl, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    }).setView([21.4235, 39.858], 12);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    const markers = sites.map((site) => {
      const icon = L.divIcon({
        className: "tanahi-map-pin",
        html: `<span class="tanahi-pin-dot ${site.tone === "warn" ? "pin-warn" : "pin-ok"}"><i class="bi bi-geo-alt-fill"></i></span>`,
        iconSize: [28, 36],
        iconAnchor: [14, 34],
      });
      const marker = L.marker([site.lat, site.lng], { icon }).addTo(map);
      marker.bindTooltip(site.name, { direction: "top", offset: [0, -28], className: "tanahi-tip" });
      marker.on("click", () => this.navigate("reports"));
      return marker;
    });

    map.fitBounds(L.featureGroup(markers).getBounds().pad(0.4));
    setTimeout(() => map.invalidateSize(), 80);
    this._homeMap = map;
  },

  bindDigital() {
    const syncNav = (id) => {
      document.querySelectorAll("#platform-nav .platform-nav-item").forEach((b) => {
        b.classList.toggle("active", b.dataset.platformPanel === id);
      });
      document.querySelectorAll("#platform-nav .nav-section").forEach((g) => {
        const hasActive = !!g.querySelector(`.platform-nav-item[data-platform-panel="${id}"]`);
        g.classList.toggle("has-active", hasActive);
      });
    };

    const showPanel = (id) => {
      const prev = document.querySelector(".platform-panel.active");
      const next = document.querySelector(`.platform-panel[data-platform-panel="${id}"]`);
      if (!next || prev === next) {
        syncNav(id);
        return;
      }
      sessionStorage.setItem("digital_panel", id);
      syncNav(id);
      if (prev) {
        prev.classList.add("is-leaving");
        prev.classList.remove("active");
        setTimeout(() => prev.classList.remove("is-leaving"), 280);
      }
      next.classList.add("active");
      document.querySelector(".platform-main")?.scrollTo({ top: 0, behavior: "smooth" });
      if (id === "home") setTimeout(() => this.initDigitalMap(), 40);
      if (id === "mobile" && typeof MobileSim !== "undefined") {
        setTimeout(() => MobileSim.bind(), 30);
      }
    };

    document.querySelectorAll("#platform-nav .platform-nav-item, .platform-goto").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.platformPanel;
        if (!id) return;
        showPanel(id);
      });
    });

    const current = sessionStorage.getItem("digital_panel") || "home";
    syncNav(current);
    if (current === "home") this.initDigitalMap();
    if (current === "mobile" && typeof MobileSim !== "undefined") {
      setTimeout(() => MobileSim.bind(), 30);
    }
  },

  initDigitalMap() {
    const mapEl = document.getElementById("digital-ops-map");
    if (!mapEl || typeof L === "undefined") return;
    if (!mapEl.offsetParent && !mapEl.closest(".platform-panel.active")) return;

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

    setTimeout(() => map.invalidateSize(), 80);
    this._digitalMap = map;
  },

  bindAttendance() {
    const filter = document.getElementById("att-filter");
    const refresh = document.getElementById("att-refresh");
    const apply = () => {
      const val = filter.value;
      const rows = val === "all"
        ? AppData.attendance
        : AppData.attendance.filter((a) => a.project === val);
      document.getElementById("att-body").innerHTML = Views._attendanceRows(rows);
      this.toast("تم تحديث سجل الحضور");
    };
    filter?.addEventListener("change", apply);
    refresh?.addEventListener("click", apply);
  },

  bindVehicles() {
    document.getElementById("add-vehicle-log")?.addEventListener("click", () => {
      this.promptForm({
        title: "تسجيل حركة مركبة",
        fields: [
          { name: "plate", label: "رقم اللوحة", required: true },
          { name: "type", label: "النوع", type: "select", options: ["مسجلة", "غير مسجلة"] },
          { name: "direction", label: "الاتجاه", type: "select", options: ["دخول", "خروج"] },
          { name: "gate", label: "البوابة", value: "البوابة 1" },
          { name: "project", label: "المشروع", type: "select", options: AppData.projects.map((p) => p.name) },
        ],
        onSubmit: (data) => {
          const now = new Date();
          const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
          AppData.vehicles.log.unshift({ ...data, time });
          this.navigate("vehicles");
          this.toast("تم تسجيل حركة المركبة");
        },
      });
    });

    document.getElementById("add-registered")?.addEventListener("click", () => {
      this.promptForm({
        title: "إضافة مركبة مسجلة",
        fields: [
          { name: "plate", label: "رقم اللوحة", required: true },
          { name: "owner", label: "المالك", required: true },
          { name: "model", label: "الطراز", required: true },
        ],
        onSubmit: (data) => {
          AppData.vehicles.registered.push({ ...data, status: "مسموح" });
          this.navigate("vehicles");
          this.toast("تمت إضافة المركبة المسجلة");
        },
      });
    });

    document.getElementById("add-banned")?.addEventListener("click", () => {
      this.promptForm({
        title: "إضافة مركبة ممنوعة",
        fields: [
          { name: "plate", label: "رقم اللوحة", required: true },
          { name: "reason", label: "سبب المنع", required: true },
        ],
        onSubmit: (data) => {
          AppData.vehicles.banned.push({
            ...data,
            date: new Date().toISOString().slice(0, 10),
            by: "عميل البوابة",
          });
          this.navigate("vehicles");
          this.toast("تمت إضافة المركبة لقائمة المنع");
        },
      });
    });

    document.querySelectorAll(".unban-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.index);
        AppData.vehicles.banned.splice(i, 1);
        this.navigate("vehicles");
        this.toast("تم رفع الحظر");
      });
    });

    document.querySelectorAll(".verify-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.toast(`تم التحقق من المركبة ${btn.dataset.plate}`);
      });
    });
  },

  bindQuote() {
    document.getElementById("quote-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Object.assign(AppData.quote, Object.fromEntries(fd.entries()));
      this.toast("تم إرسال طلب عرض السعر بنجاح");
    });
  },

  bindContract() {
    document.getElementById("contract-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Object.assign(AppData.contract, Object.fromEntries(fd.entries()));
      this.toast("تم حفظ بيانات العقد");
    });
  },

  bindApproval() {
    document.getElementById("sign-client")?.addEventListener("click", () => {
      AppData.approval.clientSign = AppData.client.name;
      document.getElementById("client-sign-line").textContent = AppData.approval.clientSign;
      this.toast("تم توقيع العميل");
    });

    document.getElementById("sign-provider")?.addEventListener("click", () => {
      AppData.approval.providerSign = AppData.provider.name;
      document.getElementById("provider-sign-line").textContent = AppData.approval.providerSign;
      this.toast("تم توقيع سنام للحراسات الأمنية");
    });

    document.getElementById("approve-project")?.addEventListener("click", () => {
      if (!AppData.approval.clientSign || !AppData.approval.providerSign) {
        this.toast("يلزم توقيع الطرفين قبل الاعتماد");
        return;
      }
      AppData.approval.approved = true;
      document.getElementById("approval-status").textContent = "معتمد";
      this.toast("تم اعتماد المشروع بنجاح");
    });

    document.getElementById("export-pdf")?.addEventListener("click", () => this.exportApprovalPdf());
  },

  async exportApprovalPdf() {
    const el = document.getElementById("approval-doc");
    if (!el || !window.html2canvas || !window.jspdf) {
      this.toast("مكتبة التصدير غير جاهزة بعد — حاول ثانية");
      return;
    }
    this.toast("جاري تجهيز ملف PDF...");
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const img = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 16;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 8;
      pdf.addImage(img, "PNG", 8, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 16;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 8;
        pdf.addPage();
        pdf.addImage(img, "PNG", 8, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 16;
      }
      pdf.save(`${AppData.approval.projectCode}-اعتماد-المشروع.pdf`);
      this.toast("تم تصدير PDF بنجاح");
    } catch (err) {
      console.error(err);
      this.toast("تعذر تصدير PDF");
    }
  },

  bindTasks() {
    document.getElementById("add-task")?.addEventListener("click", () => {
      this.promptForm({
        title: "إضافة مهمة متابعة",
        fields: [
          { name: "title", label: "عنوان المهمة", required: true },
          { name: "priority", label: "الأولوية", type: "select", options: ["عالية", "متوسطة", "منخفضة"] },
          { name: "due", label: "الاستحقاق", value: "هذا الأسبوع" },
        ],
        onSubmit: (data) => {
          AppData.tasks.unshift({
            id: Date.now(),
            ...data,
            status: "جديدة",
          });
          this.navigate("tasks");
          this.toast("تمت إضافة المهمة");
        },
      });
    });
  },

  bindLetters() {
    const zone = document.getElementById("letter-upload");
    const fileInput = document.getElementById("letter-file");
    zone?.addEventListener("click", () => fileInput.click());
    zone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag");
    });
    zone?.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone?.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag");
      if (e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        this.toast(`تم اختيار: ${e.dataTransfer.files[0].name}`);
      }
    });
    fileInput?.addEventListener("change", () => {
      if (fileInput.files[0]) this.toast(`تم اختيار: ${fileInput.files[0].name}`);
    });

    document.getElementById("submit-letter")?.addEventListener("click", () => {
      const title = document.getElementById("letter-title").value.trim() || "خطاب عميل جديد";
      AppData.letters.unshift({
        id: Date.now(),
        title,
        date: new Date().toISOString().slice(0, 10),
        type: "وارد من العميل",
        status: "مستلم",
      });
      this.navigate("letters");
      this.toast("تم رفع الخطاب إلى النظام");
    });

    document.querySelectorAll(".use-template").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const tpl = AppData.templates.find((t) => t.id === id);
        this.toast(`تم فتح النموذج: ${tpl?.name || ""}`);
        if (id === "T1") this.navigate("quote");
        else if (id === "T4") this.navigate("approval");
        else if (id === "T5") this.openLettersTab("add-guards");
        else if (id === "T6") this.openLettersTab("terminate");
        else if (id === "T2") this.navigate("reports");
      });
    });

    document.getElementById("add-guards-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      AppData.guardRequests.unshift({
        id: Date.now(),
        project: data.project,
        currentGuards: Number(data.currentGuards),
        extraGuards: Number(data.extraGuards),
        reason: data.reason,
        date: new Date().toISOString().slice(0, 10),
        status: "قيد المراجعة",
      });
      AppData.letters.unshift({
        id: Date.now() + 1,
        title: `طلب إضافة ${data.extraGuards} حراس — ${data.project}`,
        date: new Date().toISOString().slice(0, 10),
        type: "طلب إضافة حراس",
        status: "مرسل",
      });
      this.navigate("letters");
      this.openLettersTab("add-guards");
      this.toast("تم إرسال طلب إضافة الحراس");
    });

    document.getElementById("terminate-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      AppData.terminationLetters.unshift({
        id: Date.now(),
        project: data.project,
        endDate: data.endDate,
        reason: data.reason,
        notice: data.notice,
        date: new Date().toISOString().slice(0, 10),
        status: "صادر",
        notes: data.notes || "",
        company: data.company,
      });
      AppData.letters.unshift({
        id: Date.now() + 1,
        title: `خطاب إنهاء تعاقد — ${data.project}`,
        date: new Date().toISOString().slice(0, 10),
        type: "إنهاء تعاقد",
        status: "صادر",
      });
      this.navigate("letters");
      this.openLettersTab("terminate");
      this.toast("تم إصدار خطاب إنهاء التعاقد");
    });
  },

  openLettersTab(tabName) {
    if (this.currentView !== "letters") this.navigate("letters");
    requestAnimationFrame(() => {
      const tabs = document.querySelector('[data-tabs="letters"]');
      if (!tabs) return;
      const tab = tabs.querySelector(`[data-tab="${tabName}"]`);
      if (!tab) return;
      tab.click();
    });
  },

  bindEvaluations() {
    document.getElementById("eval-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const discipline = Number(data.discipline);
      const appearance = Number(data.appearance);
      const performance = Number(data.performance);
      const cooperation = Number(data.cooperation);
      const avg = Math.round(((discipline + appearance + performance + cooperation) / 4) * 10) / 10;
      AppData.evaluations.unshift({
        id: Date.now(),
        guard: data.guard,
        project: data.project,
        discipline,
        appearance,
        performance,
        cooperation,
        notes: data.notes || "",
        date: new Date().toISOString().slice(0, 10),
        avg,
      });
      this.navigate("evaluations");
      this.toast(`تم حفظ تقييم ${data.guard} — ${avg} / 5`);
    });
  },

  bindReports() {
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
        this.navigate("reports");
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
          this.navigate("reports");
          this.toast("تم تسجيل البلاغ");
        },
      });
    });

    document.getElementById("issue-daily")?.addEventListener("click", () => {
      AppData.dailyReports.unshift({
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        project: AppData.projects[0].name,
        summary: "تقرير يومي صادر من البوابة — الوضع العام مستقر",
        author: "عميل البوابة",
      });
      this.navigate("reports");
      this.toast("تم إصدار التقرير اليومي");
    });
  },

  bindMessages() {
    if (typeof ClientMessages === "undefined") return;
    ClientMessages.bind({
      side: "client",
      refresh: () => this.navigate("messages"),
      toast: (m) => this.toast(m),
      promptForm: (opts) => this.promptForm(opts),
      onBadge: () => this.updateMessageBadge(),
    });
  },

  updateMessageBadge() {
    if (typeof ClientBridge === "undefined") return;
    ClientBridge.seedIfEmpty();
    const n = ClientBridge.unreadForClient(ClientBridge.CLIENT_ID);
    const el = document.getElementById("clientMsgBadge");
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
          this.navigate("users");
          this.toast("تمت إضافة المستخدم");
        },
      });
    });

    document.querySelectorAll(".del-user").forEach((btn) => {
      btn.addEventListener("click", () => {
        AppData.users.splice(Number(btn.dataset.index), 1);
        this.navigate("users");
        this.toast("تم حذف المستخدم");
      });
    });

    document.getElementById("client-account-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      Object.assign(AppData.client, Object.fromEntries(fd.entries()));
      document.getElementById("sidebar-client-name").textContent = AppData.client.name;
      document.getElementById("user-chip").textContent = AppData.client.name;
      this.toast("تم حفظ بيانات حساب العميل");
    });
  },

  promptForm({ title, fields, onSubmit }) {
    const host = document.getElementById("modal-host");
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

  toast(msg) {
    const host = document.getElementById("toast-host");
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

document.addEventListener("DOMContentLoaded", () => App.init());
