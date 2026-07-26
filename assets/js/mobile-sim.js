const MobileSim = {
  role: sessionStorage.getItem("mobile_sim_role") || "guard",
  tab: sessionStorage.getItem("mobile_sim_tab") || "home",
  siteId: sessionStorage.getItem("mobile_sim_site") || "thaqafa",
  ready: sessionStorage.getItem("mobile_sim_ready") === "1",
  prepStep: Number(sessionStorage.getItem("mobile_sim_prep") || 0),
  tourStep: Number(sessionStorage.getItem("mobile_sim_tour") || 0),
  shiftOn: sessionStorage.getItem("mobile_sim_shift") === "1",
  notifyOn: sessionStorage.getItem("mobile_sim_notify") !== "0",
  scenario: sessionStorage.getItem("mobile_sim_scenario") || "normal",

  sites: [
    { id: "thaqafa", name: "متحف حي الثقافة", guards: 64, lat: "21.4578", lng: "39.8594" },
    { id: "safiyah", name: "متحف وبلاد الصافية", guards: 64, lat: "21.3891", lng: "39.8579" },
  ],

  tourPoints: [
    { id: "gate", label: "البوابة الرئيسية", hint: "تحقق من أجهزة التفتيش" },
    { id: "east", label: "الممر الشرقي", hint: "تأكد من الكاميرات" },
    { id: "yard", label: "ساحة الزوار", hint: "مراقبة التدفق" },
    { id: "ops", label: "غرفة المراقبة", hint: "تسليم الملاحظات" },
    { id: "park", label: "مواقف الزوار", hint: "فحص الإضاءة والطوارئ" },
  ],

  roles: {
    guard: {
      id: "guard",
      title: "حارس ميداني",
      user: "فهد القحطاني",
      desc: "حضور · جولات · بلاغات · طوارئ · معدات",
      color: "green",
      tabs: [
        { id: "home", ico: "bi-house", label: "الرئيسية" },
        { id: "duty", ico: "bi-geo", label: "الجولة" },
        { id: "report", ico: "bi-exclamation-octagon", label: "بلاغ" },
        { id: "gear", ico: "bi-shield-check", label: "التجهيز" },
        { id: "more", ico: "bi-grid", label: "المزيد" },
      ],
    },
    supervisor: {
      id: "supervisor",
      title: "مشرف موقع",
      user: "سعود الغامدي",
      desc: "الفرق · الاعتماد · التعاميم · التقارير",
      color: "blue",
      tabs: [
        { id: "home", ico: "bi-speedometer2", label: "لوحة" },
        { id: "team", ico: "bi-people", label: "الفريق" },
        { id: "alerts", ico: "bi-bell", label: "بلاغات" },
        { id: "tasks", ico: "bi-list-check", label: "مهام" },
        { id: "more", ico: "bi-sliders", label: "إدارة" },
      ],
    },
    client: {
      id: "client",
      title: "عميل — تناهي",
      user: "أحمد السالم",
      desc: "مؤشرات · مواقع · بلاغات · تقارير · إشعارات",
      color: "gold",
      tabs: [
        { id: "home", ico: "bi-bar-chart", label: "المؤشرات" },
        { id: "sites", ico: "bi-geo-alt", label: "المواقع" },
        { id: "alerts", ico: "bi-shield", label: "البلاغات" },
        { id: "reports", ico: "bi-file-earmark-text", label: "التقارير" },
        { id: "inbox", ico: "bi-bell", label: "إشعارات" },
      ],
    },
  },

  site() {
    return this.sites.find((s) => s.id === this.siteId) || this.sites[0];
  },

  persist() {
    sessionStorage.setItem("mobile_sim_role", this.role);
    sessionStorage.setItem("mobile_sim_tab", this.tab);
    sessionStorage.setItem("mobile_sim_site", this.siteId);
    sessionStorage.setItem("mobile_sim_ready", this.ready ? "1" : "0");
    sessionStorage.setItem("mobile_sim_prep", String(this.prepStep));
    sessionStorage.setItem("mobile_sim_tour", String(this.tourStep));
    sessionStorage.setItem("mobile_sim_shift", this.shiftOn ? "1" : "0");
    sessionStorage.setItem("mobile_sim_notify", this.notifyOn ? "1" : "0");
    sessionStorage.setItem("mobile_sim_scenario", this.scenario);
  },

  shellHtml() {
    if (!this.ready) return this.prepShell();
    return this.appShell();
  },

  /* ===== آلية التحضير ===== */
  prepShell() {
    const steps = [
      { title: "اختيار الدور", text: "حدد دورك في منصة سنام الميدانية" },
      { title: "اختيار الموقع", text: "اربط الجلسة بأحد مواقع تناهي" },
      { title: "سيناريو التشغيل", text: "اختر وضع المحاكاة المناسب للعرض" },
      { title: "تأكيد الجاهزية", text: "فعّل الصلاحيات ثم ادخل التطبيق" },
    ];
    const step = Math.min(Math.max(this.prepStep, 0), steps.length - 1);

    return `
      <div class="mobile-sim mobile-sim-prep" id="mobile-sim">
        <div class="prep-panel">
          <div class="prep-head">
            <span class="prep-kicker">آلية تحضير التطبيق</span>
            <h4>تشغيل محاكاة سنام للجوال</h4>
            <p>خطوات قصيرة قبل الدخول لضمان محاكاة واقعية للحضور والجولات والبلاغات.</p>
          </div>

          <div class="prep-steps">
            ${steps.map((s, i) => `
              <div class="prep-step${i === step ? " active" : ""}${i < step ? " done" : ""}">
                <span class="prep-num">${i < step ? "✓" : i + 1}</span>
                <div>
                  <strong>${s.title}</strong>
                  <small>${s.text}</small>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="prep-body">
            ${this.prepBody(step)}
          </div>

          <div class="prep-actions">
            <button type="button" class="m-btn m-btn-ghost" data-prep-nav="prev" ${step === 0 ? "disabled" : ""}>رجوع</button>
            ${step < steps.length - 1
              ? `<button type="button" class="m-btn m-btn-accent" data-prep-nav="next">التالي</button>`
              : `<button type="button" class="m-btn m-btn-accent" data-prep-nav="start"><i class="bi bi-phone"></i> دخول التطبيق</button>`}
          </div>
        </div>

        <div class="phone-frame prep-preview" id="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen prep-locked">
            <div class="prep-lock-card">
              <i class="bi bi-phone-fill"></i>
              <strong>التطبيق جاهز للدخول</strong>
              <p>أكمل خطوات التحضير على اليمين لفتح محاكاة الدور المحدد.</p>
              <div class="prep-lock-meta">
                <span>${this.roles[this.role]?.title || "—"}</span>
                <span>${this.site().name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  prepBody(step) {
    if (step === 0) {
      return `
        <div class="prep-role-grid">
          ${Object.values(this.roles).map((r) => `
            <button type="button" class="prep-role${this.role === r.id ? " active" : ""}" data-mobile-role="${r.id}">
              <i class="bi ${r.id === "guard" ? "bi-person-badge" : r.id === "supervisor" ? "bi-clipboard-check" : "bi-briefcase"}"></i>
              <strong>${r.title}</strong>
              <p>${r.desc}</p>
              <small>${r.user}</small>
            </button>
          `).join("")}
        </div>
      `;
    }
    if (step === 1) {
      return `
        <div class="prep-site-grid">
          ${this.sites.map((s) => `
            <button type="button" class="prep-site${this.siteId === s.id ? " active" : ""}" data-mobile-site="${s.id}">
              <strong>${s.name}</strong>
              <p>${s.guards} حارس · إحداثيات ${s.lat}, ${s.lng}</p>
              <span class="m-badge ok">نشط</span>
            </button>
          `).join("")}
        </div>
        <label class="prep-check">
          <input type="checkbox" data-prep-opt="gps" checked disabled />
          التحقق من الموقع الجغرافي عند تسجيل الحضور
        </label>
      `;
    }
    if (step === 2) {
      const scenarios = [
        { id: "normal", title: "تشغيل اعتيادي", text: "وردية مستقرة مع جولة وجاهزية كاملة" },
        { id: "busy", title: "ذروة زوار", text: "ضغط تشغيلي وعدد بلاغات أعلى" },
        { id: "drill", title: "تمرين طوارئ", text: "محاكاة إنذار واستجابة سريعة" },
      ];
      return `
        <div class="prep-site-grid">
          ${scenarios.map((s) => `
            <button type="button" class="prep-site${this.scenario === s.id ? " active" : ""}" data-mobile-scenario="${s.id}">
              <strong>${s.title}</strong>
              <p>${s.text}</p>
            </button>
          `).join("")}
        </div>
      `;
    }
    return `
      <div class="prep-ready-list">
        <label class="prep-check"><input type="checkbox" data-prep-ready="shift" ${this.shiftOn ? "checked" : ""}/> تأكيد استلام الوردية للموقع المختار</label>
        <label class="prep-check"><input type="checkbox" data-prep-ready="notify" ${this.notifyOn ? "checked" : ""}/> تفعيل إشعارات البلاغات والطوارئ</label>
        <label class="prep-check"><input type="checkbox" data-prep-ready="gear" checked/> مراجعة قائمة المعدات والتجهيز</label>
        <label class="prep-check"><input type="checkbox" data-prep-ready="policy" checked/> الالتزام بإجراءات سنام التشغيلية</label>
      </div>
      <div class="prep-summary">
        <div><span>الدور</span><b>${this.roles[this.role].title}</b></div>
        <div><span>الموقع</span><b>${this.site().name}</b></div>
        <div><span>السيناريو</span><b>${this.scenarioLabel()}</b></div>
      </div>
    `;
  },

  scenarioLabel() {
    return ({ normal: "تشغيل اعتيادي", busy: "ذروة زوار", drill: "تمرين طوارئ" })[this.scenario] || "تشغيل اعتيادي";
  },

  /* ===== واجهة التطبيق ===== */
  appShell() {
    return `
      <div class="mobile-sim" id="mobile-sim">
        <div class="mobile-side">
          <div class="mobile-roles">
            ${Object.values(this.roles).map((r) => `
              <button type="button" class="mobile-role-card${this.role === r.id ? " active" : ""}" data-mobile-role="${r.id}">
                <div class="role-ico"><i class="bi ${r.id === "guard" ? "bi-person-badge" : r.id === "supervisor" ? "bi-clipboard-check" : "bi-briefcase"}"></i></div>
                <strong>${r.title}</strong>
                <p>${r.desc}</p>
                <div class="role-user">${r.user}</div>
              </button>
            `).join("")}
          </div>

          <div class="mobile-site-switch">
            <span>الموقع النشط</span>
            <div class="site-switch-row">
              ${this.sites.map((s) => `
                <button type="button" class="site-chip${this.siteId === s.id ? " active" : ""}" data-mobile-site="${s.id}">${s.name.replace("متحف ", "")}</button>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="phone-frame" id="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen" id="phone-screen"></div>
        </div>

        <aside class="mobile-guide">
          <div class="guide-top">
            <h4>لوحة التحضير والخيارات</h4>
            <button type="button" class="m-btn m-btn-ghost m-btn-sm" data-mobile-action="reprep">إعادة التحضير</button>
          </div>
          <div class="guide-status">
            <div><span>الدور</span><b>${this.roles[this.role].title}</b></div>
            <div><span>الموقع</span><b>${this.site().name}</b></div>
            <div><span>السيناريو</span><b>${this.scenarioLabel()}</b></div>
            <div><span>الوردية</span><b>${this.shiftOn ? "نشطة" : "غير مفعّلة"}</b></div>
          </div>
          <ol>
            <li>بدّل الأدوار من اليمين لتجربة حارس / مشرف / عميل.</li>
            <li>غيّر الموقع النشط لمحاكاة العمل على موقعي تناهي.</li>
            <li>استخدم تبويبات التطبيق وأزرار الإجراءات داخل الشاشة.</li>
            <li>جرّب سيناريو «تمرين طوارئ» عبر إعادة التحضير.</li>
          </ol>
          <div class="guide-chips">
            <span>تحضير مسبق</span>
            <span>اختيار موقع</span>
            <span>سيناريوهات</span>
            <span>جولات نقاط</span>
            <span>بلاغات متدرجة</span>
            <span>KPIs عميل</span>
            <span>طوارئ SOS</span>
          </div>
          <div class="guide-quick">
            <button type="button" class="m-btn m-btn-primary m-btn-sm" data-mobile-action="demo-tour">تجربة جولة سريعة</button>
            <button type="button" class="m-btn m-btn-danger m-btn-sm" data-mobile-action="demo-sos">تجربة طوارئ</button>
          </div>
        </aside>
      </div>
    `;
  },

  screenHtml() {
    const role = this.roles[this.role] || this.roles.client;
    const tabs = role.tabs;
    if (!tabs.find((t) => t.id === this.tab)) this.tab = tabs[0].id;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const cols = Math.min(tabs.length, 5);

    return `
      <div class="phone-status"><span>${now}</span><span>${this.notifyOn ? "🔔" : "🔕"} · 5G · 86%</span></div>
      <div class="phone-appbar">
        <strong>سنام · ${role.title}</strong>
        <small>${role.user} · ${this.site().name}</small>
        <div class="phone-appbar-tags">
          <span>${this.scenarioLabel()}</span>
          <span class="${this.shiftOn ? "on" : ""}">${this.shiftOn ? "وردية نشطة" : "خارج الوردية"}</span>
        </div>
      </div>
      <div class="phone-body" id="phone-body">
        ${this.tabContent(role)}
      </div>
      <nav class="phone-tabbar" style="grid-template-columns:repeat(${cols},1fr)">
        ${tabs.map((t) => `
          <button type="button" class="phone-tab${this.tab === t.id ? " active" : ""}" data-mobile-tab="${t.id}">
            <i class="bi ${t.ico}"></i>
            <span>${t.label}</span>
          </button>
        `).join("")}
      </nav>
    `;
  },

  tabContent(role) {
    if (role.id === "guard") return this.guardTabs();
    if (role.id === "supervisor") return this.supervisorTabs();
    return this.clientTabs();
  },

  busyBoost() {
    return this.scenario === "busy" ? 2 : this.scenario === "drill" ? 1 : 0;
  },

  guardTabs() {
    const present = AppData.attendance.filter((a) => a.status === "حاضر").length + this.busyBoost();
    const pct = Math.round((this.tourStep / this.tourPoints.length) * 100);

    if (this.tab === "duty") {
      return `
        <div class="m-card">
          <div class="m-card-head">
            <h5>الجولة — ${this.site().name.replace("متحف ", "")}</h5>
            <span class="m-badge ${pct >= 100 ? "ok" : "warn"}">${pct}%</span>
          </div>
          <div class="m-progress"><i style="width:${pct}%"></i></div>
          ${this.tourPoints.map((p, i) => {
            const state = i < this.tourStep ? "ok" : i === this.tourStep ? "warn" : "info";
            const label = i < this.tourStep ? "تم" : i === this.tourStep ? "التالي" : "قادم";
            return `<div class="m-check-row"><div><strong style="font-size:.8rem">${p.label}</strong><p style="font-size:.7rem;color:var(--muted);margin:0">${p.hint}</p></div><span class="m-badge ${state}">${label}</span></div>`;
          }).join("")}
        </div>
        <button type="button" class="m-btn m-btn-accent" data-mobile-action="checkin-point" ${this.tourStep >= this.tourPoints.length ? "disabled" : ""}>تأكيد النقطة الحالية</button>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="finish-tour">إنهاء الجولة وإرسالها</button>
        <button type="button" class="m-btn m-btn-ghost" data-mobile-action="reset-tour">إعادة نقاط الجولة</button>
      `;
    }

    if (this.tab === "report") {
      return `
        <div class="m-card">
          <h5>رفع بلاغ ميداني</h5>
          <p class="m-hint">الموقع: ${this.site().name} · يُربط تلقائيًا بالإحداثيات</p>
          <div class="m-action-grid">
            <button type="button" class="m-tile danger" data-mobile-action="report-security"><i class="bi bi-shield-exclamation"></i><span>أمني</span></button>
            <button type="button" class="m-tile ok" data-mobile-action="report-safety"><i class="bi bi-heart-pulse"></i><span>سلامة</span></button>
            <button type="button" class="m-tile blue" data-mobile-action="report-property"><i class="bi bi-building"></i><span>ممتلكات</span></button>
            <button type="button" class="m-tile gold" data-mobile-action="report-photo"><i class="bi bi-camera"></i><span>توثيق</span></button>
          </div>
        </div>
        <div class="m-card">
          <h5>مستوى الأولوية</h5>
          <div class="m-chip-row">
            <button type="button" class="m-chip" data-mobile-action="prio-low">منخفض</button>
            <button type="button" class="m-chip" data-mobile-action="prio-mid">متوسط</button>
            <button type="button" class="m-chip active" data-mobile-action="prio-high">عالٍ</button>
          </div>
          <button type="button" class="m-btn m-btn-primary" style="margin-top:.55rem" data-mobile-action="report-voice">تسجيل ملاحظة صوتية</button>
        </div>
      `;
    }

    if (this.tab === "gear") {
      return `
        <div class="m-card">
          <h5>قائمة التجهيز قبل الوردية</h5>
          <div class="m-check-row"><span>جهاز التواصل</span><span class="m-badge ok">جاهز</span></div>
          <div class="m-check-row"><span>كشاف / بطارية</span><span class="m-badge ok">جاهز</span></div>
          <div class="m-check-row"><span>بطاقة الدخول</span><button type="button" class="m-badge warn" data-mobile-action="scan-badge">مسح</button></div>
          <div class="m-check-row"><span>نموذج التفتيش</span><button type="button" class="m-badge info" data-mobile-action="open-form">فتح</button></div>
        </div>
        <button type="button" class="m-btn m-btn-accent" data-mobile-action="gear-confirm">تأكيد اكتمال التجهيز</button>
      `;
    }

    if (this.tab === "more") {
      return `
        <div class="m-card">
          <h5>خيارات إضافية</h5>
          <button type="button" class="m-btn m-btn-danger" data-mobile-action="sos" style="margin-bottom:.4rem"><i class="bi bi-exclamation-triangle"></i> طوارئ SOS</button>
          <button type="button" class="m-btn m-btn-primary" data-mobile-action="request-cover" style="margin-bottom:.4rem">طلب تغطية نقطة</button>
          <button type="button" class="m-btn m-btn-ghost" data-mobile-action="shift-end">إنهاء الوردية</button>
        </div>
        <div class="m-card">
          <h5>التنبيهات</h5>
          <div class="m-list">
            <div class="m-item"><i class="dot" style="background:#c8a15a"></i><div><strong>تذكير جولة</strong><p>الموعد خلال 10 دقائق</p></div></div>
            <div class="m-item"><i class="dot" style="background:#3db88a"></i><div><strong>تم اعتماد حضورك</strong><p>اليوم 06:02</p></div></div>
            ${this.scenario === "drill" ? `<div class="m-item"><i class="dot" style="background:#e05b5b"></i><div><strong>تمرين طوارئ نشط</strong><p>اتبع مسار الإخلاء التجريبي</p></div></div>` : ""}
          </div>
        </div>
      `;
    }

    return `
      <div class="m-kpi-row">
        <div class="m-kpi accent"><b>${this.shiftOn ? "حاضر" : "——"}</b><span>حالة اليوم</span></div>
        <div class="m-kpi gold"><b>${pct}%</b><span>تقدم الجولة</span></div>
      </div>
      <div class="m-card">
        <h5>إجراءات سريعة</h5>
        <button type="button" class="m-btn m-btn-accent" data-mobile-action="checkin" style="margin-bottom:.4rem"><i class="bi bi-fingerprint"></i> تسجيل حضور بالموقع</button>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="start-tour" style="margin-bottom:.4rem"><i class="bi bi-signpost-2"></i> بدء جولة</button>
        <button type="button" class="m-btn m-btn-ghost" data-mobile-action="open-gear"><i class="bi bi-shield-check"></i> قائمة التجهيز</button>
      </div>
      <div class="m-card">
        <h5>ملخص الوردية</h5>
        <div class="m-list">
          <div class="m-item"><i class="dot" style="background:#3db88a"></i><div><strong>الموقع</strong><p>${this.site().name}</p></div></div>
          <div class="m-item"><i class="dot" style="background:#5b8def"></i><div><strong>الحضور في الموقع</strong><p>${present} حارس الآن</p></div></div>
          <div class="m-item"><i class="dot" style="background:#c8a15a"></i><div><strong>السيناريو</strong><p>${this.scenarioLabel()}</p></div></div>
        </div>
      </div>
    `;
  },

  supervisorTabs() {
    const open = AppData.fieldAlerts.filter((a) => a.status !== "مغلق").length + this.busyBoost();
    if (this.tab === "team") {
      return `
        <div class="m-card">
          <h5>فريق ${this.site().name.replace("متحف ", "")}</h5>
          <div class="m-list">
            ${AppData.attendance.slice(0, 5).map((a) => `
              <div class="m-item">
                <i class="dot" style="background:${a.status === "حاضر" ? "#3db88a" : "#e05b5b"}"></i>
                <div>
                  <strong>${a.name}</strong>
                  <p>${a.status} · ${a.shift}</p>
                </div>
                <button type="button" class="m-badge info" data-mobile-action="ping-guard">تنبيه</button>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="m-action-grid">
          <button type="button" class="m-tile gold" data-mobile-action="boost-shift"><i class="bi bi-people"></i><span>تعزيز</span></button>
          <button type="button" class="m-tile blue" data-mobile-action="reassign"><i class="bi bi-arrow-left-right"></i><span>إعادة توزيع</span></button>
        </div>
      `;
    }
    if (this.tab === "alerts") {
      return `
        <div class="m-card">
          <h5>طابور البلاغات (${open})</h5>
          <div class="m-list">
            ${AppData.fieldAlerts.slice(0, 5).map((a) => `
              <div class="m-item">
                <i class="dot" style="background:${a.level === "عالٍ" ? "#e05b5b" : a.level === "متوسط" ? "#c8a15a" : "#3db88a"}"></i>
                <div>
                  <strong>${a.level} · ${a.project.replace("متحف ", "")}</strong>
                  <p>${a.text.slice(0, 42)}...</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="assign-alert" style="margin-bottom:.4rem">إسناد بلاغ</button>
        <button type="button" class="m-btn m-btn-accent" data-mobile-action="escalate-alert">تصعيد لغرفة العمليات</button>
      `;
    }
    if (this.tab === "tasks") {
      return `
        <div class="m-card">
          <h5>مهام الإشراف</h5>
          <div class="m-check-row"><span>اعتماد جولة ${this.site().name.replace("متحف ", "")}</span><button type="button" class="m-badge ok" data-mobile-action="approve-tour">اعتماد</button></div>
          <div class="m-check-row"><span>مراجعة تقرير يومي</span><button type="button" class="m-badge info" data-mobile-action="review-report">فتح</button></div>
          <div class="m-check-row"><span>تمرين طوارئ</span><button type="button" class="m-badge warn" data-mobile-action="start-drill">بدء</button></div>
          <div class="m-check-row"><span>اعتماد صور التوثيق</span><button type="button" class="m-badge info" data-mobile-action="approve-photos">مراجعة</button></div>
        </div>
      `;
    }
    if (this.tab === "more") {
      return `
        <div class="m-card">
          <h5>إدارة الموقع</h5>
          <button type="button" class="m-btn m-btn-accent" data-mobile-action="broadcast" style="margin-bottom:.4rem">تعميم تنبيه</button>
          <button type="button" class="m-btn m-btn-primary" data-mobile-action="lockdown" style="margin-bottom:.4rem">تفعيل وضع الإغلاق الجزئي</button>
          <button type="button" class="m-btn m-btn-ghost" data-mobile-action="export-shift">تصدير ملخص الوردية</button>
        </div>
      `;
    }
    return `
      <div class="m-kpi-row">
        <div class="m-kpi blue"><b>${open}</b><span>بلاغات نشطة</span></div>
        <div class="m-kpi accent"><b>98%</b><span>التزام الفريق</span></div>
        <div class="m-kpi gold"><b>2.3د</b><span>الاستجابة</span></div>
        <div class="m-kpi warn"><b>${this.scenario === "drill" ? "ON" : "1"}</b><span>${this.scenario === "drill" ? "تمرين" : "جولة"}</span></div>
      </div>
      <div class="m-card">
        <h5>إجراءات المشرف</h5>
        <button type="button" class="m-btn m-btn-accent" data-mobile-action="broadcast" style="margin-bottom:.4rem">تعميم تنبيه للموقع</button>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="refresh-ops" style="margin-bottom:.4rem">تحديث لوحة التشغيل</button>
        <button type="button" class="m-btn m-btn-ghost" data-mobile-action="open-tasks">فتح قائمة المهام</button>
      </div>
    `;
  },

  clientTabs() {
    const open = AppData.fieldAlerts.filter((a) => a.status === "مفتوح").length + this.busyBoost();
    const sites = AppData.projects;

    if (this.tab === "sites") {
      return `
        <div class="m-card">
          <h5>مواقع تناهي للاستثمار</h5>
          <div class="m-list">
            ${sites.map((p, idx) => `
              <div class="m-item">
                <i class="dot" style="background:#c8a15a"></i>
                <div style="flex:1">
                  <strong>${p.name}</strong>
                  <p>${p.guards} حارس · ${p.status}</p>
                  <div class="m-progress"><i style="width:${p.name.includes("ثقافة") ? 96 : 94}%"></i></div>
                </div>
                <button type="button" class="m-badge info" data-mobile-action="focus-site" data-site-idx="${idx}">تفاصيل</button>
              </div>
            `).join("")}
          </div>
        </div>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="open-map">عرض على خريطة المنصة</button>
      `;
    }
    if (this.tab === "alerts") {
      return `
        <div class="m-kpi-row">
          <div class="m-kpi warn"><b>${open}</b><span>مفتوح</span></div>
          <div class="m-kpi accent"><b>${AppData.fieldAlerts.filter((a) => a.status === "مغلق").length}</b><span>مغلق</span></div>
        </div>
        <div class="m-card">
          <h5>آخر البلاغات</h5>
          <div class="m-list">
            ${AppData.fieldAlerts.slice(0, 5).map((a) => `
              <div class="m-item">
                <i class="dot" style="background:${a.status === "مفتوح" ? "#e05b5b" : "#3db88a"}"></i>
                <div><strong>${a.project.replace("متحف ", "")}</strong><p>${a.level} · ${a.status} · ${a.type}</p></div>
              </div>
            `).join("")}
          </div>
        </div>
        <button type="button" class="m-btn m-btn-ghost" data-mobile-action="open-platform-alerts">فتح بلاغات المنصة</button>
      `;
    }
    if (this.tab === "reports") {
      return `
        <div class="m-card">
          <h5>التقارير التنفيذية</h5>
          <div class="m-list">
            ${AppData.dailyReports.slice(0, 4).map((r) => `
              <div class="m-item">
                <i class="dot" style="background:#5b8def"></i>
                <div><strong>${r.date}</strong><p>${r.project.replace("متحف ", "")} — ${r.summary.slice(0, 36)}...</p></div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="m-action-grid">
          <button type="button" class="m-tile gold" data-mobile-action="download-report"><i class="bi bi-filetype-pdf"></i><span>PDF</span></button>
          <button type="button" class="m-tile blue" data-mobile-action="share-report"><i class="bi bi-share"></i><span>مشاركة</span></button>
        </div>
      `;
    }
    if (this.tab === "inbox") {
      return `
        <div class="m-card">
          <h5>إشعارات العميل</h5>
          <div class="m-list">
            <div class="m-item"><i class="dot" style="background:#c8a15a"></i><div><strong>تقرير يومي جاهز</strong><p>متحف حي الثقافة — منذ ساعة</p></div></div>
            <div class="m-item"><i class="dot" style="background:#5b8def"></i><div><strong>اكتمال جولة مسائية</strong><p>متحف وبلاد الصافية</p></div></div>
            <div class="m-item"><i class="dot" style="background:#e05b5b"></i><div><strong>بلاغ قيد المعالجة</strong><p>أولوية متوسطة</p></div></div>
            ${this.notifyOn ? "" : `<div class="m-item"><i class="dot" style="background:#999"></i><div><strong>الإشعارات موقوفة</strong><p>فعّلها من التحضير</p></div></div>`}
          </div>
        </div>
        <button type="button" class="m-btn m-btn-primary" data-mobile-action="open-messages">فتح التواصل والإشعارات</button>
      `;
    }
    return `
      <div class="m-card m-card-hero">
        <h5>مؤشرات تناهي — مباشر</h5>
        <p class="m-hint" style="color:rgba(255,255,255,.75)">متابعة من تطبيق العميل · ${this.scenarioLabel()}</p>
        <div class="m-kpi-row">
          <div class="m-kpi dark"><b>98%</b><span>الحضور</span></div>
          <div class="m-kpi dark"><b>95%</b><span>الجولات</span></div>
          <div class="m-kpi dark"><b>2.3د</b><span>الاستجابة</span></div>
          <div class="m-kpi dark"><b>4.8</b><span>التقييم</span></div>
        </div>
      </div>
      <div class="m-card">
        <h5>مقارنة المواقع</h5>
        <div class="m-check-row"><span>متحف حي الثقافة</span><b style="color:#067647">96%</b></div>
        <div class="m-progress"><i style="width:96%"></i></div>
        <div class="m-check-row" style="margin-top:.55rem"><span>متحف وبلاد الصافية</span><b style="color:#8a6d2f">94%</b></div>
        <div class="m-progress"><i style="width:94%;background:linear-gradient(90deg,#c8a15a,#e08c3c)"></i></div>
      </div>
      <button type="button" class="m-btn m-btn-primary" data-mobile-action="refresh-kpi">تحديث المؤشرات</button>
    `;
  },

  bind(root = document) {
    const host = root.querySelector("#mobile-sim") || document.getElementById("mobile-sim");
    if (!host) return;

    if (this.ready) this.renderPhone();
    if (host.dataset.mobileBound === "1") return;
    host.dataset.mobileBound = "1";

    host.addEventListener("click", (e) => {
      const roleBtn = e.target.closest("[data-mobile-role]");
      if (roleBtn && host.contains(roleBtn)) {
        this.role = roleBtn.dataset.mobileRole;
        this.tab = this.roles[this.role].tabs[0].id;
        this.persist();
        if (!this.ready) this.rerenderShell();
        else {
          host.querySelectorAll("[data-mobile-role]").forEach((b) => {
            b.classList.toggle("active", b.dataset.mobileRole === this.role);
          });
          const guide = host.querySelector(".mobile-guide");
          if (guide) {
            const status = guide.querySelector(".guide-status");
            if (status) {
              status.innerHTML = `
                <div><span>الدور</span><b>${this.roles[this.role].title}</b></div>
                <div><span>الموقع</span><b>${this.site().name}</b></div>
                <div><span>السيناريو</span><b>${this.scenarioLabel()}</b></div>
                <div><span>الوردية</span><b>${this.shiftOn ? "نشطة" : "غير مفعّلة"}</b></div>
              `;
            }
          }
          this.renderPhone();
        }
        return;
      }

      const siteBtn = e.target.closest("[data-mobile-site]");
      if (siteBtn && host.contains(siteBtn)) {
        this.siteId = siteBtn.dataset.mobileSite;
        this.persist();
        if (!this.ready) this.rerenderShell();
        else {
          host.querySelectorAll("[data-mobile-site]").forEach((b) => {
            b.classList.toggle("active", b.dataset.mobileSite === this.siteId);
          });
          this.renderPhone();
          this.phoneToast(`تم التحويل إلى ${this.site().name}`);
        }
        return;
      }

      const scenarioBtn = e.target.closest("[data-mobile-scenario]");
      if (scenarioBtn && host.contains(scenarioBtn)) {
        this.scenario = scenarioBtn.dataset.mobileScenario;
        this.persist();
        this.rerenderShell();
        return;
      }

      const prepNav = e.target.closest("[data-prep-nav]");
      if (prepNav && host.contains(prepNav)) {
        const dir = prepNav.dataset.prepNav;
        if (dir === "prev") this.prepStep = Math.max(0, this.prepStep - 1);
        if (dir === "next") this.prepStep = Math.min(3, this.prepStep + 1);
        if (dir === "start") {
          const readyBoxes = [...host.querySelectorAll("[data-prep-ready]")];
          const ok = readyBoxes.length ? readyBoxes.every((el) => el.checked) : true;
          if (!ok) {
            this.phoneToast("أكمل تأكيدات الجاهزية أولًا");
            return;
          }
          this.shiftOn = !!host.querySelector('[data-prep-ready="shift"]')?.checked;
          this.notifyOn = !!host.querySelector('[data-prep-ready="notify"]')?.checked;
          this.ready = true;
          this.tab = this.roles[this.role].tabs[0].id;
          this.persist();
          this.rerenderShell();
          this.phoneToast("تم دخول التطبيق بنجاح");
          return;
        }
        this.persist();
        this.rerenderShell();
        return;
      }

      const actionBtn = e.target.closest("[data-mobile-action]");
      if (actionBtn && host.contains(actionBtn)) {
        this.action(actionBtn.dataset.mobileAction, actionBtn);
      }
    });

    host.addEventListener("change", (e) => {
      const el = e.target.closest("[data-prep-ready]");
      if (!el) return;
      if (el.dataset.prepReady === "shift") this.shiftOn = el.checked;
      if (el.dataset.prepReady === "notify") this.notifyOn = el.checked;
      this.persist();
    });
  },

  rerenderShell() {
    const panel = document.querySelector('.platform-panel[data-platform-panel="mobile"] .plat-section');
    if (!panel) return;
    const head = `
      <div class="plat-section-head">
        <h3>تطبيق الجوال</h3>
        <p>محاكاة كاملة مع آلية تحضير وخيارات أدوار ومواقع وسيناريوهات تشغيل</p>
      </div>
    `;
    panel.innerHTML = head + this.shellHtml();
    const host = document.getElementById("mobile-sim");
    if (host) host.dataset.mobileBound = "";
    this.bind();
  },

  renderPhone() {
    const screen = document.getElementById("phone-screen");
    if (!screen) return;
    screen.innerHTML = this.screenHtml();

    screen.querySelectorAll("[data-mobile-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.tab = btn.dataset.mobileTab;
        this.persist();
        this.renderPhone();
      });
    });

    screen.querySelectorAll("[data-mobile-action]").forEach((btn) => {
      btn.addEventListener("click", () => this.action(btn.dataset.mobileAction, btn));
    });
  },

  phoneToast(msg) {
    const frame = document.getElementById("phone-frame");
    if (!frame) {
      if (typeof DigitalApp !== "undefined" && DigitalApp.toast) DigitalApp.toast(msg);
      return;
    }
    frame.querySelector(".m-toast")?.remove();
    const el = document.createElement("div");
    el.className = "m-toast";
    el.textContent = msg;
    frame.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  },

  action(type, btn) {
    const messages = {
      checkin: "تم تسجيل الحضور بالموقع بنجاح",
      "start-tour": "بدأت الجولة — انتقل لتبويب الجولة",
      "checkin-point": "تم تأكيد نقطة التفتيش",
      "finish-tour": "اكتملت الجولة وأُرسلت للمشرف",
      "reset-tour": "أُعيدت نقاط الجولة من البداية",
      "report-security": "تم إنشاء بلاغ أمني مسودة",
      "report-safety": "تم تسجيل ملاحظة سلامة",
      "report-property": "تم تسجيل بلاغ ممتلكات",
      "report-photo": "تم إرفاق صورة التوثيق",
      "report-voice": "تم حفظ الملاحظة الصوتية",
      "prio-low": "الأولوية: منخفض",
      "prio-mid": "الأولوية: متوسط",
      "prio-high": "الأولوية: عالٍ",
      sos: "تم إرسال إشارة طوارئ لغرفة العمليات",
      "shift-end": "تم إنهاء الوردية",
      "request-cover": "أُرسل طلب تغطية النقطة",
      "scan-badge": "تم مسح بطاقة الدخول",
      "open-form": "فُتح نموذج التفتيش",
      "gear-confirm": "اكتمل التجهيز — جاهز للوردية",
      "open-gear": "قائمة التجهيز",
      "boost-shift": "أُرسل طلب تعزيز الوردية",
      reassign: "تمت إعادة توزيع الحراس",
      "ping-guard": "تم إرسال تنبيه للحارس",
      "assign-alert": "تم إسناد البلاغ لحارس متاح",
      "escalate-alert": "تم التصعيد لغرفة العمليات",
      broadcast: "تم تعميم التنبيه على الفريق",
      "refresh-ops": "تم تحديث بيانات التشغيل",
      "approve-tour": "تم اعتماد الجولة",
      "review-report": "التقرير جاهز للمراجعة",
      "start-drill": "بدأ تمرين الطوارئ",
      "approve-photos": "قيد مراجعة صور التوثيق",
      lockdown: "وضع الإغلاق الجزئي مفعّل",
      "export-shift": "جاري تصدير ملخص الوردية...",
      "open-tasks": "قائمة المهام",
      "open-map": "فتح خريطة المواقع من الرئيسية",
      "download-report": "جاري تجهيز ملخص PDF...",
      "share-report": "تم تجهيز رابط مشاركة التقرير",
      "refresh-kpi": "تم تحديث مؤشرات تناهي",
      "focus-site": "تم فتح تفاصيل الموقع",
      "open-platform-alerts": "فتح بلاغات المنصة",
      "open-messages": "فتح التواصل والإشعارات",
      reprep: "العودة لآلية التحضير",
      "demo-tour": "تشغيل تجربة الجولة",
      "demo-sos": "تشغيل تجربة الطوارئ",
    };

    if (type === "checkin") {
      this.shiftOn = true;
      this.persist();
      this.renderPhone();
    }
    if (type === "shift-end") {
      this.shiftOn = false;
      this.persist();
      this.renderPhone();
    }
    if (type === "start-tour" || type === "demo-tour") {
      this.role = "guard";
      this.tab = "duty";
      if (type === "demo-tour") this.tourStep = 0;
      this.persist();
      this.rerenderShell();
      this.phoneToast(messages[type]);
      return;
    }
    if (type === "checkin-point") {
      this.tourStep = Math.min(this.tourPoints.length, this.tourStep + 1);
      this.persist();
      this.renderPhone();
    }
    if (type === "reset-tour") {
      this.tourStep = 0;
      this.persist();
      this.renderPhone();
    }
    if (type === "finish-tour") {
      this.tourStep = this.tourPoints.length;
      this.persist();
      this.renderPhone();
    }
    if (type === "open-gear") {
      this.tab = "gear";
      this.persist();
      this.renderPhone();
    }
    if (type === "open-tasks") {
      this.tab = "tasks";
      this.persist();
      this.renderPhone();
    }
    if (type === "start-drill" || type === "demo-sos") {
      this.scenario = "drill";
      if (type === "demo-sos") {
        this.role = "guard";
        this.tab = "more";
      }
      this.persist();
      this.rerenderShell();
      setTimeout(() => this.action("sos"), 400);
      this.phoneToast(messages[type]);
      return;
    }
    if (type === "reprep") {
      this.ready = false;
      this.prepStep = 0;
      this.persist();
      this.rerenderShell();
      return;
    }
    if (type === "open-map") {
      if (typeof DigitalApp !== "undefined" && DigitalApp.showPanel) DigitalApp.showPanel("home");
    }
    if (type === "open-platform-alerts") {
      if (typeof DigitalApp !== "undefined" && DigitalApp.showPanel) DigitalApp.showPanel("alerts");
    }
    if (type === "open-messages") {
      if (typeof DigitalApp !== "undefined" && DigitalApp.showPanel) DigitalApp.showPanel("messages");
    }
    if (type === "focus-site") {
      const idx = Number(btn?.dataset?.siteIdx || 0);
      this.siteId = this.sites[idx]?.id || this.siteId;
      this.persist();
      this.renderPhone();
    }
    if (type.startsWith("prio-") && btn) {
      btn.parentElement?.querySelectorAll(".m-chip").forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
    }

    this.phoneToast(messages[type] || "تم تنفيذ الإجراء");
  },
};

if (typeof window !== "undefined") window.MobileSim = MobileSim;
