const Views = {
  meta: {
    dashboard: { title: "تناهي للاستثمار", subtitle: "لوحة التحكم الرئيسية · متحف حي الثقافة · متحف وبلاد الصافية" },
    attendance: { title: "الحضور والانصراف", subtitle: "متابعة حضور حراس مشاريعك لحظة بلحظة" },
    vehicles: { title: "إدارة المركبات", subtitle: "دخول وخروج · مسجلة وغير مسجلة · الممنوعة" },
    parking: { title: "المواقف المتاحة", subtitle: "مراقبة حالة المواقف في مواقع المشاريع" },
    quote: { title: "طلب عرض السعر", subtitle: "المرحلة الأولى — تقديم طلب عرض السعر كقالب" },
    contract: { title: "التنفيذ والعقد", subtitle: "المرحلة الثانية — توقيع العلاقة التعاقدية" },
    approval: { title: "اعتماد المشروع", subtitle: "صفحة الاعتماد الرسمية مع إمكانية التصدير PDF" },
    tasks: { title: "المهام", subtitle: "مهام المتابعة التشغيلية لمشاريعك" },
    letters: { title: "الخطابات والنماذج", subtitle: "رفع خطابات العميل ونماذج المراسلات المعتمدة" },
    evaluations: { title: "تقييم الحراس", subtitle: "تقييم أداء الحراس والمشرفين في المشاريع" },
    reports: { title: "البلاغات والحوادث", subtitle: "لوحة متابعة البلاغات لمواقع تناهي للاستثمار" },
    permissions: { title: "الصلاحيات", subtitle: "اطلاع على الموظفين واستلام التقارير الأمنية" },
    messages: { title: "التواصل والإشعارات", subtitle: "مراسلات وطلبات مربوطة بإدارة سنام للحراسات الأمنية" },
    users: { title: "مستخدمو العميل", subtitle: "إدارة حسابات الدخول للبوابة" },
    digital: { title: "التقنية والتحول الرقمي", subtitle: "منصة تشغيل ذكية تدعم الرقابة، ورفع الكفاءة، واتخاذ القرار" },
  },

  dashboard() {
    const sites = AppData.projects.length;
    const personnel = 128;
    const attendanceRate = 98;
    const achievement = 92;
    const alerts = AppData.fieldAlerts;
    const statusCounts = {
      جديد: alerts.filter((a) => a.status === "مفتوح").length,
      معالجة: alerts.filter((a) => a.status === "قيد المعالجة").length,
      محلول: alerts.filter((a) => a.status === "مغلق" && a.level !== "منخفض").length || 2,
      مغلق: alerts.filter((a) => a.status === "مغلق").length,
    };
    const totalAlerts = Math.max(alerts.length, 1);
    const byType = [
      { label: "أمنية", count: alerts.filter((a) => a.type === "أمني" || a.type === "طوارئ").length || 3, color: "#5b8def" },
      { label: "سلامة", count: alerts.filter((a) => a.type === "ميداني").length || 2, color: "#e05b5b" },
      { label: "ممتلكات", count: alerts.filter((a) => a.type === "صيانة").length || 2, color: "#c8a15a" },
      { label: "أخرى", count: alerts.filter((a) => a.type === "تشغيلي").length || 1, color: "#3db88a" },
    ];
    const typeMax = Math.max(...byType.map((t) => t.count), 1);
    const kpiMonths = [
      { m: "يناير", v: 72 },
      { m: "فبراير", v: 78 },
      { m: "مارس", v: 74 },
      { m: "أبريل", v: 85 },
      { m: "مايو", v: 88 },
      { m: "يونيو", v: 94 },
    ];
    const activities = [
      { time: "10:30", text: "جولة دورية — متحف حي الثقافة", tone: "warn" },
      { time: "09:45", text: "بلاغ أمني — متحف وبلاد الصافية", tone: "danger" },
      { time: "08:15", text: "تفتيش مدخل — متحف حي الثقافة", tone: "ok" },
      { time: "07:50", text: "جولة مفاجئة — متحف وبلاد الصافية", tone: "ok" },
    ];

    const sNew = statusCounts.جديد;
    const sProc = statusCounts.معالجة;
    const sDone = statusCounts.محلول;
    const sClosed = statusCounts.مغلق;
    const sumStatus = sNew + sProc + sDone + sClosed || 1;
    const p1 = (sNew / sumStatus) * 100;
    const p2 = (sProc / sumStatus) * 100;
    const p3 = (sDone / sumStatus) * 100;

    const now = new Date();
    const weekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const dateLabel = `${weekdays[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    const timeLabel = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const linePoints = kpiMonths.map((k, i) => {
      const x = (i / (kpiMonths.length - 1)) * 100;
      const y = 100 - k.v;
      return `${x},${y}`;
    }).join(" ");

    return `
      <section class="view control-dash">
        <div class="control-head">
          <div>
            <p class="control-kicker">لوحة التحكم الرئيسية</p>
            <h3 class="client-gold">تناهي للاستثمار</h3>
            <p class="control-sites"><span>متحف حي الثقافة</span><span>متحف وبلاد الصافية</span></p>
          </div>
          <div class="control-clock">
            <strong>${dateLabel}</strong>
            <span>${timeLabel}</span>
          </div>
        </div>

        <div class="control-kpi-row">
          <div class="control-kpi">
            <div class="control-kpi-ico"><i class="bi bi-geo-alt-fill"></i></div>
            <div><span>إجمالي المواقع</span><strong>${sites}</strong></div>
          </div>
          <div class="control-kpi">
            <div class="control-kpi-ico"><i class="bi bi-people-fill"></i></div>
            <div><span>إجمالي أفراد الأمن</span><strong>${personnel.toLocaleString("en-US")}</strong></div>
          </div>
          <div class="control-kpi control-kpi-ring">
            <div class="control-ring teal" style="--p:${attendanceRate}"><span>${attendanceRate}%</span></div>
            <div><span>الحماية اليوم</span><strong>نسبة الحضور</strong></div>
          </div>
          <div class="control-kpi control-kpi-ring">
            <div class="control-ring gold" style="--p:${achievement}"><span>${achievement}%</span></div>
            <div><span>نسبة الالتزام</span><strong>نسبة الإنجاز</strong></div>
          </div>
        </div>

        <div class="control-mid">
          <div class="control-card">
            <div class="control-card-head">
              <h4>خريطة المواقع</h4>
              <button type="button" class="btn btn-sm control-link" data-go="reports">البلاغات</button>
            </div>
            <div class="control-map" id="home-ops-map"></div>
          </div>

          <div class="control-card">
            <div class="control-card-head">
              <h4>الحوادث والحالات</h4>
              <button type="button" class="btn btn-sm control-link" data-go="reports">التفاصيل</button>
            </div>
            <div class="control-incident">
              <div class="control-donut" style="--a:${p1}%; --b:${p1 + p2}%; --c:${p1 + p2 + p3}%">
                <div class="control-donut-center">
                  <strong>${totalAlerts}</strong>
                  <span>بلاغ</span>
                </div>
              </div>
              <ul class="control-legend">
                <li><i style="background:#5b8def"></i> جديد <b>${sNew}</b></li>
                <li><i style="background:#e05b5b"></i> قيد المعالجة <b>${sProc}</b></li>
                <li><i style="background:#c8a15a"></i> تم الحل <b>${sDone}</b></li>
                <li><i style="background:#3db88a"></i> مغلق <b>${sClosed}</b></li>
              </ul>
            </div>
          </div>
        </div>

        <div class="control-bottom">
          <div class="control-card">
            <div class="control-card-head"><h4>مؤشرات الأداء الرئيسية</h4></div>
            <div class="control-line-wrap">
              <svg class="control-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="kpiFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(200,161,90,.35)"/>
                    <stop offset="100%" stop-color="rgba(200,161,90,0)"/>
                  </linearGradient>
                </defs>
                <polyline fill="url(#kpiFill)" stroke="none" points="0,100 ${linePoints} 100,100"></polyline>
                <polyline fill="none" stroke="#c8a15a" stroke-width="2.2" points="${linePoints}"></polyline>
              </svg>
              <div class="control-line-labels">
                ${kpiMonths.map((k) => `<span>${k.m}</span>`).join("")}
              </div>
            </div>
          </div>

          <div class="control-card">
            <div class="control-card-head"><h4>الحوادث حسب النوع</h4></div>
            <div class="control-hbar">
              ${byType.map((t) => `
                <div class="control-hbar-row">
                  <span>${t.label}</span>
                  <div class="control-hbar-track"><i style="width:${Math.round((t.count / typeMax) * 100)}%;background:${t.color}"></i></div>
                  <b>${t.count}</b>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="control-card">
            <div class="control-card-head"><h4>أحدث الأنشطة</h4></div>
            <ul class="control-activity">
              ${activities.map((a) => `
                <li>
                  <i class="tone-${a.tone}"></i>
                  <div>
                    <strong>${a.time}</strong>
                    <p>${a.text}</p>
                  </div>
                </li>
              `).join("")}
            </ul>
          </div>
        </div>
      </section>
    `;
  },

  attendance() {
    return `
      <section class="view">
        <div class="stats-grid">
          <div class="stat"><div class="label">حاضر</div><div class="value">${AppData.attendance.filter(a=>a.status==="حاضر").length}</div></div>
          <div class="stat orange"><div class="label">انصرف</div><div class="value">${AppData.attendance.filter(a=>a.status==="انصرف").length}</div></div>
          <div class="stat danger"><div class="label">غائب</div><div class="value">${AppData.attendance.filter(a=>a.status==="غائب").length}</div></div>
          <div class="stat warn"><div class="label">المشاريع</div><div class="value">${AppData.projects.length}</div></div>
        </div>
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3>سجل الحضور والانصراف</h3>
              <p>تحديث لحظي حسب المشروع والوردية</p>
            </div>
            <div class="actions-row" style="margin:0">
              <select id="att-filter">
                <option value="all">كل المشاريع</option>
                ${AppData.projects.map((p) => `<option value="${p.name}">${p.name}</option>`).join("")}
              </select>
              <button class="btn btn-secondary btn-sm" id="att-refresh">تحديث</button>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>الحارس</th><th>المشروع</th><th>الوردية</th><th>الدخول</th><th>الخروج</th><th>الحالة</th></tr>
              </thead>
              <tbody id="att-body">
                ${this._attendanceRows(AppData.attendance)}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  },

  _attendanceRows(rows) {
    return rows.map((a) => `
      <tr data-project="${a.project}">
        <td>${a.name}</td>
        <td>${a.project}</td>
        <td>${a.shift}</td>
        <td>${a.in}</td>
        <td>${a.out}</td>
        <td><span class="badge ${a.status === "حاضر" ? "badge-ok" : a.status === "غائب" ? "badge-danger" : "badge-muted"}">${a.status}</span></td>
      </tr>
    `).join("");
  },

  vehicles() {
    return `
      <section class="view">
        <div class="tabs" data-tabs="vehicles">
          <button class="tab active" data-tab="log">الدخول والخروج</button>
          <button class="tab" data-tab="reg">المركبات المسجلة</button>
          <button class="tab" data-tab="unreg">غير المسجلة</button>
          <button class="tab" data-tab="ban">المركبات الممنوعة</button>
        </div>

        <div class="tab-panel active" data-panel="log">
          <div class="panel">
            <div class="panel-head">
              <div><h3>سجل المركبات الداخلة والخارجة</h3><p>مراقبة البوابات لحظة بلحظة</p></div>
              <button class="btn btn-primary btn-sm" id="add-vehicle-log">تسجيل حركة</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>اللوحة</th><th>النوع</th><th>الاتجاه</th><th>البوابة</th><th>الوقت</th><th>المشروع</th></tr></thead>
                <tbody>
                  ${AppData.vehicles.log.map((v) => `
                    <tr>
                      <td><strong>${v.plate}</strong></td>
                      <td><span class="badge ${v.type === "مسجلة" ? "badge-info" : "badge-warn"}">${v.type}</span></td>
                      <td><span class="badge ${v.direction === "دخول" ? "badge-ok" : "badge-muted"}">${v.direction}</span></td>
                      <td>${v.gate}</td>
                      <td>${v.time}</td>
                      <td>${v.project}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="reg">
          <div class="panel">
            <div class="panel-head">
              <div><h3>قسم دخول المركبات المسجلة</h3><p>مركبات مصرح لها مسبقاً</p></div>
              <button class="btn btn-secondary btn-sm" id="add-registered">إضافة مركبة مسجلة</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>اللوحة</th><th>المالك</th><th>الطراز</th><th>الحالة</th></tr></thead>
                <tbody>
                  ${AppData.vehicles.registered.map((v) => `
                    <tr><td>${v.plate}</td><td>${v.owner}</td><td>${v.model}</td><td><span class="badge badge-ok">${v.status}</span></td></tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="unreg">
          <div class="panel">
            <div class="panel-head">
              <div><h3>قسم المركبات غير المسجلة</h3><p>تتطلب تحقق ميداني قبل السماح بالدخول</p></div>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>اللوحة</th><th>الاتجاه</th><th>البوابة</th><th>الوقت</th><th>الإجراء</th></tr></thead>
                <tbody>
                  ${AppData.vehicles.log.filter((v) => v.type === "غير مسجلة").map((v) => `
                    <tr>
                      <td>${v.plate}</td><td>${v.direction}</td><td>${v.gate}</td><td>${v.time}</td>
                      <td><button class="btn btn-secondary btn-sm verify-btn" data-plate="${v.plate}">تحقق</button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="ban">
          <div class="panel">
            <div class="panel-head">
              <div><h3>إدارة المركبات الممنوعة</h3><p>قائمة الحظر النشطة</p></div>
              <button class="btn btn-accent btn-sm" id="add-banned">إضافة للقائمة السوداء</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>اللوحة</th><th>السبب</th><th>التاريخ</th><th>بواسطة</th><th></th></tr></thead>
                <tbody id="banned-body">
                  ${AppData.vehicles.banned.map((v, i) => `
                    <tr>
                      <td><strong>${v.plate}</strong></td>
                      <td>${v.reason}</td>
                      <td>${v.date}</td>
                      <td>${v.by}</td>
                      <td><button class="btn btn-danger btn-sm unban-btn" data-index="${i}">رفع الحظر</button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  parking() {
    const labels = { free: "متاح", busy: "مشغول", reserved: "محجوز" };
    return `
      <section class="view">
        <div class="stats-grid">
          <div class="stat"><div class="label">الإجمالي</div><div class="value">${AppData.parking.total}</div></div>
          <div class="stat"><div class="label">متاح</div><div class="value">${AppData.parking.free}</div></div>
          <div class="stat danger"><div class="label">مشغول</div><div class="value">${AppData.parking.busy}</div></div>
          <div class="stat warn"><div class="label">محجوز</div><div class="value">${AppData.parking.reserved}</div></div>
        </div>
        <div class="panel">
          <div class="panel-head">
            <div><h3>خريطة المواقف</h3><p>حالة كل موقف في الموقع الرئيسي</p></div>
          </div>
          <div class="parking-grid">
            ${AppData.parking.slots.map((s) => `
              <div class="slot ${s.state}" title="${labels[s.state]}">P${s.id}</div>
            `).join("")}
          </div>
          <div class="legend">
            <span><i style="background:rgba(6,118,71,.35)"></i> متاح</span>
            <span><i style="background:rgba(180,35,24,.35)"></i> مشغول</span>
            <span><i style="background:rgba(181,71,8,.35)"></i> محجوز</span>
          </div>
        </div>
      </section>
    `;
  },

  quote() {
    const q = AppData.quote;
    return `
      <section class="view">
        <div class="steps">
          <div class="step active"><div class="n">1</div><strong>مرحلة الطلب</strong><p style="color:var(--muted);font-size:.85rem;margin-top:.25rem">تقديم عرض السعر</p></div>
          <div class="step-line"></div>
          <div class="step"><div class="n">2</div><strong>مرحلة التنفيذ</strong><p style="color:var(--muted);font-size:.85rem;margin-top:.25rem">توقيع العقد</p></div>
        </div>
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3>قالب طلب عرض السعر</h3>
              <p>عبّئ البيانات التالية لإرسال طلب رسمي</p>
            </div>
          </div>
          <form class="form-grid" id="quote-form">
            <label><span>اسم المنشأة</span><input name="company" value="${q.company}" required /></label>
            <label><span>موجه لمَن</span><input name="directedTo" value="${q.directedTo}" required /></label>
            <label class="full"><span>شرح الموقع</span><textarea name="siteDesc" required>${q.siteDesc}</textarea></label>
            <label><span>المدة</span><input name="duration" value="${q.duration}" required /></label>
            <label><span>عدد الحراس المطلوب</span><input name="guards" value="${q.guards}" required /></label>
            <label class="full"><span>شرح المهام</span><textarea name="tasks" required>${q.tasks}</textarea></label>
            <label class="full"><span>وسيلة التواصل</span><input name="contact" value="${q.contact}" required /></label>
            <div class="full actions-row">
              <button type="submit" class="btn btn-primary">إرسال طلب عرض السعر</button>
              <button type="button" class="btn btn-secondary" data-go="contract">الانتقال لمرحلة التنفيذ</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  contract() {
    const c = AppData.contract;
    return `
      <section class="view">
        <div class="steps">
          <div class="step"><div class="n">1</div><strong>مرحلة الطلب</strong><p style="color:var(--muted);font-size:.85rem;margin-top:.25rem">مكتملة</p></div>
          <div class="step-line"></div>
          <div class="step active"><div class="n">2</div><strong>مرحلة التنفيذ</strong><p style="color:var(--muted);font-size:.85rem;margin-top:.25rem">توقيع العقد</p></div>
        </div>
        <div class="grid-2">
          <div class="panel">
            <div class="panel-head"><div><h3>صيغة العلاقة التعاقدية</h3><p>نموذج عقد خدمات الحراسة</p></div></div>
            <form class="form-grid" id="contract-form">
              <label><span>الحراسة المطلوبة</span><input name="guardsRequired" value="${c.guardsRequired}" /></label>
              <label><span>ساعات العمل</span><input name="workHours" value="${c.workHours}" /></label>
              <label class="full"><span>الفترة الزمنية</span><input name="period" value="${c.period}" /></label>
              <label class="full"><span>توضيح العلاقة التعاقدية</span><textarea name="relation">${c.relation}</textarea></label>
              <div class="full">
                <span style="display:block;margin-bottom:.5rem;font-size:.85rem;color:var(--ink-soft);font-weight:500">بنود العقد</span>
                <ul style="padding-inline-start:1.2rem;color:var(--ink-soft);display:grid;gap:.4rem">
                  ${c.clauses.map((x) => `<li>${x}</li>`).join("")}
                </ul>
              </div>
              <div class="full actions-row">
                <button type="submit" class="btn btn-primary">حفظ بيانات العقد</button>
                <button type="button" class="btn btn-accent" data-go="approval">فتح صفحة اعتماد المشروع</button>
              </div>
            </form>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>معاينة مختصرة</h3><p>ملخص ما سيظهر في الاعتماد</p></div></div>
            <div class="list-stack">
              <div class="list-item"><span class="dot"></span><div class="body"><strong>الحراسة</strong><p>${c.guardsRequired}</p></div></div>
              <div class="list-item"><span class="dot"></span><div class="body"><strong>ساعات العمل</strong><p>${c.workHours}</p></div></div>
              <div class="list-item"><span class="dot"></span><div class="body"><strong>الفترة</strong><p>${c.period}</p></div></div>
              <div class="list-item"><span class="dot"></span><div class="body"><strong>العلاقة</strong><p>${c.relation}</p></div></div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  approval() {
    const a = AppData.approval;
    const c = AppData.contract;
    const q = AppData.quote;
    return `
      <section class="view">
        <div class="actions-row" style="justify-content:center;margin-bottom:1.25rem">
          <button class="btn btn-primary" id="export-pdf">تصدير PDF</button>
          <button class="btn btn-accent" id="sign-client">توقيع العميل</button>
          <button class="btn btn-secondary" id="sign-provider">توقيع سنام</button>
          <button class="btn btn-ghost" id="approve-project">اعتماد المشروع</button>
        </div>
        <div class="doc-sheet" id="approval-doc">
          <div class="doc-header">
            <div class="brand-mark" style="margin-bottom:.75rem">س</div>
            <h2>صفحة اعتماد المشروع</h2>
            <p style="color:var(--muted)">${AppData.provider.name} — ${a.projectCode}</p>
          </div>
          <div class="doc-meta">
            <div><strong>اسم المشروع</strong>${a.projectName}</div>
            <div><strong>التاريخ</strong>${a.date}</div>
            <div><strong>اسم المنشأة</strong>${q.company}</div>
            <div><strong>موجه إلى</strong>${q.directedTo}</div>
            <div><strong>الحراسة المطلوبة</strong>${c.guardsRequired}</div>
            <div><strong>ساعات العمل</strong>${c.workHours}</div>
            <div><strong>الفترة الزمنية</strong>${c.period}</div>
            <div><strong>حالة الاعتماد</strong><span id="approval-status">${a.approved ? "معتمد" : "بانتظار التوقيع"}</span></div>
          </div>
          <div class="doc-section">
            <h4>شرح الموقع والمهام</h4>
            <p>${q.siteDesc}</p>
            <p style="margin-top:.5rem">${q.tasks}</p>
          </div>
          <div class="doc-section">
            <h4>العلاقة التعاقدية</h4>
            <p>${c.relation}</p>
            <ul style="margin-top:.75rem;padding-inline-start:1.2rem;display:grid;gap:.35rem">
              ${c.clauses.map((x) => `<li>${x}</li>`).join("")}
            </ul>
          </div>
          <div class="sign-row">
            <div class="sign-box">
              <div class="sign-line" id="client-sign-line">${a.clientSign || ""}</div>
              <strong>توقيع الطرف الأول (العميل)</strong>
              <p style="font-size:.85rem;color:var(--muted)">${q.company}</p>
            </div>
            <div class="sign-box">
              <div class="sign-line" id="provider-sign-line">${a.providerSign || ""}</div>
              <strong>توقيع الطرف الثاني</strong>
              <p style="font-size:.85rem;color:var(--muted)">${AppData.provider.name}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  tasks() {
    return `
      <section class="view">
        <div class="panel">
          <div class="panel-head">
            <div><h3>مهام المتابعة</h3><p>المرحلة الثانية — قسم المتابعة التشغيلية</p></div>
            <button class="btn btn-primary btn-sm" id="add-task">إضافة مهمة</button>
          </div>
          <div class="list-stack" id="tasks-list">
            ${AppData.tasks.map((t) => `
              <div class="list-item">
                <span class="dot" style="background:${t.priority === "عالية" ? "var(--danger)" : t.priority === "متوسطة" ? "var(--warn)" : "var(--accent)"}"></span>
                <div class="body">
                  <strong>${t.title}</strong>
                  <p>الأولوية: ${t.priority} · الاستحقاق: ${t.due}</p>
                </div>
                <span class="badge ${t.status === "مكتمل" ? "badge-ok" : t.status === "جديدة" ? "badge-info" : "badge-warn"}">${t.status}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </section>
    `;
  },

  letters() {
    const projectOpts = AppData.projects.map((p) => `<option value="${p.name}">${p.name}</option>`).join("");
    return `
      <section class="view">
        <div class="tabs" data-tabs="letters">
          <button class="tab active" data-tab="upload">رفع الخطابات</button>
          <button class="tab" data-tab="templates">النماذج</button>
          <button class="tab" data-tab="add-guards">طلب إضافة حراس</button>
          <button class="tab" data-tab="terminate">إنهاء التعاقد</button>
        </div>

        <div class="tab-panel active" data-panel="upload">
          <div class="grid-2">
            <div class="panel">
              <div class="panel-head">
                <div><h3>رفع خطاب العميل</h3><p>ارفع الخطابات الرسمية إلى النظام</p></div>
              </div>
              <div class="upload-zone" id="letter-upload">
                <strong>اسحب الملف هنا أو انقر للاختيار</strong>
                <span>PDF أو Word — بحد أقصى 10MB</span>
                <input type="file" id="letter-file" accept=".pdf,.doc,.docx" hidden />
              </div>
              <div class="actions-row">
                <input type="text" id="letter-title" placeholder="عنوان الخطاب" style="flex:1;min-width:180px" />
                <button class="btn btn-primary" id="submit-letter">رفع الخطاب</button>
              </div>
            </div>
            <div class="panel">
              <div class="panel-head"><div><h3>سجل الخطابات</h3><p>الخطابات المرفوعة سابقاً</p></div></div>
              <div class="table-wrap">
                <table>
                  <thead><tr><th>العنوان</th><th>النوع</th><th>التاريخ</th><th>الحالة</th></tr></thead>
                  <tbody id="letters-body">
                    ${AppData.letters.map((l) => `
                      <tr><td>${l.title}</td><td>${l.type}</td><td>${l.date}</td><td><span class="badge badge-info">${l.status}</span></td></tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="templates">
          <div class="panel">
            <div class="panel-head">
              <div><h3>نماذج الخطابات</h3><p>قوالب جاهزة للاستخدام والتعبئة</p></div>
            </div>
            <div class="list-stack">
              ${AppData.templates.map((t) => `
                <div class="list-item">
                  <span class="dot"></span>
                  <div class="body"><strong>${t.name}</strong><p>${t.desc}</p></div>
                  <button class="btn btn-secondary btn-sm use-template" data-id="${t.id}">استخدام</button>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="add-guards">
          <div class="grid-2">
            <div class="panel">
              <div class="panel-head">
                <div><h3>نموذج طلب إضافة عدد حراس</h3><p>قدّم طلباً رسمياً لزيادة عدد الحراس</p></div>
              </div>
              <form class="form-grid" id="add-guards-form">
                <label><span>المشروع</span><select name="project" required>${projectOpts}</select></label>
                <label><span>العدد الحالي</span><input name="currentGuards" type="number" min="0" value="12" required /></label>
                <label><span>عدد الحراس المطلوب إضافتهم</span><input name="extraGuards" type="number" min="1" value="3" required /></label>
                <label><span>تاريخ بدء التعزيز</span><input name="startDate" type="date" required /></label>
                <label class="full"><span>سبب الطلب / شرح الاحتياج</span><textarea name="reason" required placeholder="مثال: تعزيز المناوبة المسائية بسبب توسعة الموقع"></textarea></label>
                <label class="full"><span>وسيلة التواصل للمتابعة</span><input name="contact" value="${AppData.quote.contact}" required /></label>
                <div class="full actions-row">
                  <button type="submit" class="btn btn-primary">إرسال الطلب</button>
                </div>
              </form>
            </div>
            <div class="panel">
              <div class="panel-head"><div><h3>طلبات إضافة الحراس</h3><p>سجل الطلبات المرسلة</p></div></div>
              <div class="table-wrap">
                <table>
                  <thead><tr><th>المشروع</th><th>الحالي</th><th>الإضافة</th><th>السبب</th><th>التاريخ</th><th>الحالة</th></tr></thead>
                  <tbody id="guard-requests-body">
                    ${AppData.guardRequests.map((r) => `
                      <tr>
                        <td>${r.project}</td>
                        <td>${r.currentGuards}</td>
                        <td><strong>+${r.extraGuards}</strong></td>
                        <td>${r.reason}</td>
                        <td>${r.date}</td>
                        <td><span class="badge badge-warn">${r.status}</span></td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-panel" data-panel="terminate">
          <div class="grid-2">
            <div class="panel">
              <div class="panel-head">
                <div><h3>نموذج خطاب إنهاء التعاقد</h3><p>خطاب رسمي لإنهاء العلاقة التعاقدية</p></div>
              </div>
              <form class="form-grid" id="terminate-form">
                <label><span>اسم المنشأة</span><input name="company" value="${AppData.client.name}" required /></label>
                <label><span>المشروع / العقد</span><select name="project" required>${projectOpts}</select></label>
                <label><span>تاريخ إنهاء التعاقد</span><input name="endDate" type="date" required /></label>
                <label><span>مدة الإشعار</span>
                  <select name="notice" required>
                    <option value="30 يوماً">30 يوماً</option>
                    <option value="60 يوماً">60 يوماً</option>
                    <option value="حسب العقد">حسب العقد</option>
                  </select>
                </label>
                <label class="full"><span>سبب إنهاء التعاقد</span><textarea name="reason" required placeholder="اذكر سبب إنهاء العلاقة التعاقدية..."></textarea></label>
                <label class="full"><span>ملاحظات إضافية</span><textarea name="notes" placeholder="أي ترتيبات تسليم أو ملاحظات ختامية"></textarea></label>
                <div class="full actions-row">
                  <button type="submit" class="btn btn-accent">إصدار خطاب الإنهاء</button>
                </div>
              </form>
            </div>
            <div class="panel">
              <div class="panel-head"><div><h3>خطابات إنهاء التعاقد</h3><p>السجل والمعاينة</p></div></div>
              <div class="list-stack" id="termination-list">
                ${AppData.terminationLetters.map((t) => `
                  <div class="list-item">
                    <span class="dot" style="background:var(--danger)"></span>
                    <div class="body">
                      <strong>${t.project}</strong>
                      <p>الإنهاء: ${t.endDate} · الإشعار: ${t.notice} · ${t.reason}</p>
                    </div>
                    <span class="badge badge-muted">${t.status}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  evaluations() {
    const guards = [...new Set([
      ...AppData.employees.map((e) => e.name),
      ...AppData.attendance.map((a) => a.name),
    ])];
    const avgAll = AppData.evaluations.length
      ? (AppData.evaluations.reduce((s, e) => s + e.avg, 0) / AppData.evaluations.length).toFixed(1)
      : "—";
    const top = AppData.evaluations.length
      ? [...AppData.evaluations].sort((a, b) => b.avg - a.avg)[0]
      : null;

    return `
      <section class="view">
        <div class="stats-grid">
          <div class="stat">
            <div class="label">عدد التقييمات</div>
            <div class="value">${AppData.evaluations.length}</div>
            <div class="meta">سجل معتمد</div>
          </div>
          <div class="stat orange">
            <div class="label">متوسط التقييم العام</div>
            <div class="value">${avgAll}</div>
            <div class="meta">من 5 نجوم</div>
          </div>
          <div class="stat">
            <div class="label">أعلى تقييم</div>
            <div class="value">${top ? top.avg : "—"}</div>
            <div class="meta">${top ? top.guard : "لا يوجد"}</div>
          </div>
          <div class="stat warn">
            <div class="label">حراس قابلون للتقييم</div>
            <div class="value">${guards.length}</div>
            <div class="meta">في المشاريع النشطة</div>
          </div>
        </div>

        <div class="grid-2">
          <div class="panel">
            <div class="panel-head">
              <div><h3>نموذج تقييم حارس</h3><p>قيّم الأداء وفق معايير واضحة</p></div>
            </div>
            <form class="form-grid" id="eval-form">
              <label><span>اسم الحارس</span>
                <select name="guard" required>
                  ${guards.map((g) => `<option value="${g}">${g}</option>`).join("")}
                </select>
              </label>
              <label><span>المشروع</span>
                <select name="project" required>
                  ${AppData.projects.map((p) => `<option value="${p.name}">${p.name}</option>`).join("")}
                </select>
              </label>
              <label><span>الانضباط</span>
                <select name="discipline" required>${[1,2,3,4,5].map((n) => `<option value="${n}" ${n===4?"selected":""}>${n} ★</option>`).join("")}</select>
              </label>
              <label><span>المظهر العام</span>
                <select name="appearance" required>${[1,2,3,4,5].map((n) => `<option value="${n}" ${n===4?"selected":""}>${n} ★</option>`).join("")}</select>
              </label>
              <label><span>الأداء الميداني</span>
                <select name="performance" required>${[1,2,3,4,5].map((n) => `<option value="${n}" ${n===4?"selected":""}>${n} ★</option>`).join("")}</select>
              </label>
              <label><span>التعاون والتواصل</span>
                <select name="cooperation" required>${[1,2,3,4,5].map((n) => `<option value="${n}" ${n===4?"selected":""}>${n} ★</option>`).join("")}</select>
              </label>
              <label class="full"><span>ملاحظات التقييم</span><textarea name="notes" placeholder="ملاحظات إضافية عن أداء الحارس..."></textarea></label>
              <div class="full actions-row">
                <button type="submit" class="btn btn-primary">حفظ التقييم</button>
              </div>
            </form>
          </div>

          <div class="panel">
            <div class="panel-head">
              <div><h3>سجل تقييم الحراس</h3><p>آخر التقييمات المسجّلة</p></div>
            </div>
            <div class="list-stack" id="evals-list">
              ${AppData.evaluations.map((e) => `
                <div class="list-item">
                  <span class="dot" style="background:${e.avg >= 4.5 ? "var(--ok)" : e.avg >= 3.5 ? "var(--warn)" : "var(--danger)"}"></span>
                  <div class="body">
                    <strong>${e.guard}</strong>
                    <p>${e.project} · ${e.date}</p>
                    <div class="stars-row" aria-label="التقييم ${e.avg}">
                      ${this._stars(e.avg)}
                      <span class="avg-num">${e.avg.toFixed(1)}</span>
                    </div>
                    <p style="margin-top:.35rem">${e.notes || "بدون ملاحظات"}</p>
                    <div class="eval-criteria">
                      <span>انضباط ${e.discipline}</span>
                      <span>مظهر ${e.appearance}</span>
                      <span>أداء ${e.performance}</span>
                      <span>تعاون ${e.cooperation}</span>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  _stars(avg) {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5;
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= full) html += '<span class="star on">★</span>';
      else if (i === full + 1 && half) html += '<span class="star half">★</span>';
      else html += '<span class="star">★</span>';
    }
    return html;
  },

  reportsInner() {
    const alerts = AppData.fieldAlerts;
    const open = alerts.filter((a) => a.status === "مفتوح").length;
    const processing = alerts.filter((a) => a.status === "قيد المعالجة").length;
    const closed = alerts.filter((a) => a.status === "مغلق").length;
    const high = alerts.filter((a) => a.level === "عالٍ" && a.status !== "مغلق").length;
    const maxCount = Math.max(...AppData.incidentTrend.map((d) => d.count), 1);

    const levelClass = (lvl) => (lvl === "عالٍ" ? "badge-danger" : lvl === "متوسط" ? "badge-warn" : "badge-ok");
    const statusClass = (s) => (s === "مفتوح" ? "badge-danger" : s === "قيد المعالجة" ? "badge-warn" : "badge-ok");

    return `
        <div class="alerts-dash plat-alerts">
        <div class="ops-kpi-row">
          <div class="ops-kpi-card">
            <div class="ops-kpi-ico"><i class="bi bi-exclamation-octagon"></i></div>
            <div><span class="label">إجمالي البلاغات</span><strong>${alerts.length}</strong></div>
          </div>
          <div class="ops-kpi-card">
            <div class="ops-kpi-ico" style="background:linear-gradient(145deg,#8a1f1a,#b42318)"><i class="bi bi-lightning-charge"></i></div>
            <div><span class="label">عالية مفتوحة</span><strong>${high}</strong></div>
          </div>
          <div class="ops-kpi-card">
            <div class="ops-kpi-ico" style="background:linear-gradient(145deg,#8a5a12,#b54708)"><i class="bi bi-hourglass-split"></i></div>
            <div><span class="label">قيد المعالجة</span><strong>${processing}</strong></div>
          </div>
          <div class="ops-kpi-card">
            <div class="ops-kpi-ico" style="background:linear-gradient(145deg,#0a5c3a,#067647)"><i class="bi bi-check2-circle"></i></div>
            <div><span class="label">مغلقة</span><strong>${closed}</strong></div>
          </div>
        </div>

        <div class="ops-bottom-grid">
          <div class="panel">
            <div class="panel-head">
              <div><h3>اتجاه البلاغات</h3><p>آخر 6 أيام · مفتوح الآن ${open}</p></div>
            </div>
            <div class="ops-bars-chart alerts-bars">
              ${AppData.incidentTrend.map((b) => `
                <div class="ops-bar-col">
                  <div class="ops-bar" style="--h:${Math.round((b.count / maxCount) * 100)}%"></div>
                  <span>${b.day}</span>
                  <em>${b.count}</em>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>حسب الموقع</h3><p>توزيع البلاغات النشطة</p></div></div>
            <div class="site-alert-split">
              ${["متحف حي الثقافة", "متحف وبلاد الصافية"].map((site) => {
                const list = alerts.filter((a) => a.project === site);
                const active = list.filter((a) => a.status !== "مغلق").length;
                return `
                  <div class="site-alert-card">
                    <strong class="client-gold">${site}</strong>
                    <div class="site-alert-nums">
                      <span><b>${list.length}</b> بلاغ</span>
                      <span><b>${active}</b> نشط</span>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div><h3>سجل البلاغات</h3><p>تصفية ومتابعة حالات البلاغات</p></div>
            <button class="btn btn-primary btn-sm" id="add-alert">تسجيل بلاغ</button>
          </div>
          <div class="alerts-filters">
            <select id="alert-site">
              <option value="all">كل المواقع</option>
              <option>متحف حي الثقافة</option>
              <option>متحف وبلاد الصافية</option>
            </select>
            <select id="alert-level">
              <option value="all">كل المستويات</option>
              <option>عالٍ</option>
              <option>متوسط</option>
              <option>منخفض</option>
            </select>
            <select id="alert-status">
              <option value="all">كل الحالات</option>
              <option>مفتوح</option>
              <option>قيد المعالجة</option>
              <option>مغلق</option>
            </select>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>الوقت</th>
                  <th>الموقع</th>
                  <th>النوع</th>
                  <th>المستوى</th>
                  <th>الوصف</th>
                  <th>المسؤول</th>
                  <th>الحالة</th>
                  <th></th>
                </tr>
              </thead>
              <tbody id="alerts-body">
                ${alerts.map((a) => `
                  <tr data-site="${a.project}" data-level="${a.level}" data-status="${a.status}">
                    <td>${a.date}<br><small>${a.time}</small></td>
                    <td>${a.project}</td>
                    <td>${a.type || "—"}</td>
                    <td><span class="badge ${levelClass(a.level)}">${a.level}</span></td>
                    <td>${a.text}</td>
                    <td>${a.handler || "—"}</td>
                    <td><span class="badge ${statusClass(a.status)}">${a.status}</span></td>
                    <td class="alerts-actions">
                      ${a.status !== "مغلق" ? `
                        <button class="btn btn-secondary btn-sm alert-advance" data-id="${a.id}">
                          ${a.status === "مفتوح" ? "بدء المعالجة" : "إغلاق"}
                        </button>
                      ` : `<span class="badge badge-muted">منتهٍ</span>`}
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="tabs" data-tabs="reports">
          <button class="tab active" data-tab="daily">التقارير اليومية</button>
          <button class="tab" data-tab="security">التقارير الأمنية</button>
        </div>
        <div class="tab-panel active" data-panel="daily">
          <div class="panel">
            <div class="panel-head">
              <div><h3>التقارير اليومية</h3><p>ملخص يومي لكل موقع</p></div>
              <button class="btn btn-primary btn-sm" id="issue-daily">إصدار تقرير اليوم</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>التاريخ</th><th>الموقع</th><th>الملخص</th><th>المُعد</th></tr></thead>
                <tbody id="daily-body">
                  ${AppData.dailyReports.map((r) => `
                    <tr><td>${r.date}</td><td>${r.project}</td><td>${r.summary}</td><td>${r.author}</td></tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="tab-panel" data-panel="security">
          <div class="panel">
            <div class="panel-head"><div><h3>التقارير الأمنية</h3><p>تقارير معتمدة للمواقع</p></div></div>
            <div class="list-stack">
              <div class="list-item"><span class="dot"></span><div class="body"><strong>تقرير أمني أسبوعي — متحف حي الثقافة</strong><p>تم الاستلام · جاهز للمراجعة</p></div><span class="badge badge-ok">جديد</span></div>
              <div class="list-item"><span class="dot"></span><div class="body"><strong>تقرير الجولات — متحف وبلاد الصافية</strong><p>لا ملاحظات حرجة</p></div><span class="badge badge-info">مقروء</span></div>
            </div>
          </div>
        </div>
        </div>
    `;
  },

  reports() {
    return `
      <section class="view alerts-dash">
        ${this.reportsInner()}
      </section>
    `;
  },

  permissions() {
    const yes = (v) => v ? '<span class="badge badge-ok">نعم</span>' : '<span class="badge badge-muted">لا</span>';
    return `
      <section class="view">
        <div class="grid-2">
          <div class="panel">
            <div class="panel-head"><div><h3>مصفوفة الصلاحيات</h3><p>من يطلع على الموظفين ويستلم التقارير</p></div></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>الدور</th><th>اطلاع موظفين</th><th>تقارير أمنية</th><th>المركبات</th><th>التعاقد</th></tr>
                </thead>
                <tbody>
                  ${AppData.permissions.map((p) => `
                    <tr>
                      <td>${p.role}</td>
                      <td>${yes(p.viewEmployees)}</td>
                      <td>${yes(p.receiveReports)}</td>
                      <td>${yes(p.manageVehicles)}</td>
                      <td>${yes(p.contracts)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>اطلاع على الموظفين</h3><p>قائمة الحراس والمشرفين في مشاريعك</p></div></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>الاسم</th><th>الدور</th><th>المشروع</th><th>الوردية</th></tr></thead>
                <tbody>
                  ${AppData.employees.map((e) => `
                    <tr><td>${e.name}</td><td>${e.role}</td><td>${e.project}</td><td>${e.shift}</td></tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  messagesInner(side = "client") {
    if (typeof ClientBridge !== "undefined") ClientBridge.seedIfEmpty();
    const isAdmin = side === "admin";
    const all = (typeof ClientBridge !== "undefined")
      ? ClientBridge.getThreads(ClientBridge.CLIENT_ID)
      : [];
    const q = sessionStorage.getItem("client_thread_q") || "";
    const kind = sessionStorage.getItem("client_thread_kind") || "";
    const sort = sessionStorage.getItem("client_thread_sort") || "newest";
    const listOpen = sessionStorage.getItem("client_list_dd") === "1";
    const chatOpen = sessionStorage.getItem("client_chat_dd") === "1";
    const threads = (typeof ClientBridge !== "undefined")
      ? ClientBridge.filterThreads(all, { q, kind, sort })
      : all;
    const selectedId = sessionStorage.getItem("client_thread_id") || threads[0]?.id || "";
    const selected = all.find((t) => t.id === selectedId) || threads[0];
    const chatQ = sessionStorage.getItem("client_chat_q") || "";
    const chatKind = sessionStorage.getItem("client_chat_kind") || "";
    const chatMsgs = selected && typeof ClientBridge !== "undefined"
      ? ClientBridge.filterMessages(selected.messages, { q: chatQ, kind: chatKind })
      : (selected?.messages || []);
    const esc = (s) => (typeof ClientBridge !== "undefined" ? ClientBridge.escapeHtml(s) : String(s || ""));
    const chip = (k, label, active) =>
      `<button type="button" class="cn-chip ${active ? "active" : ""}" data-client-kind="${k}">${label}</button>`;
    const listActive = !!(q || kind || sort !== "newest");
    const chatActive = !!(chatQ || chatKind);
    const unreadOf = (t) => (isAdmin ? (t.unreadAdmin || 0) : (t.unreadClient || 0));
    const composePrefix = isAdmin ? "admin" : "client";

    return `
        <div class="grid-2 plat-messages" style="align-items:start;gap:1rem" data-msg-side="${side}">
          <div class="panel">
            <div class="panel-head">
              <div><h3>المحادثات</h3><p>${threads.length} محادثة · ${isAdmin ? "منصة سنام" : "بوابة العميل"}</p></div>
              <div style="display:flex;gap:.4rem;align-items:center">
                <div class="cn-dd">
                  <button type="button" class="btn btn-sm cn-dd-btn ${listOpen || listActive ? "open has-filter" : ""}" id="client-list-dd-btn" aria-expanded="${listOpen ? "true" : "false"}">
                    ⌕ بحث وتصفية ${listActive ? '<span class="cn-dd-dot"></span>' : ""}
                  </button>
                  <div class="cn-dd-menu" id="client-list-dd-menu" ${listOpen ? "" : "hidden"}>
                    <div class="cn-dd-title">بحث وتصفية المحادثات</div>
                    <input type="search" id="client-thread-search" value="${esc(q)}"
                      placeholder="ابحث في الموضوع أو الرسائل..."
                      style="width:100%;margin-bottom:.5rem;padding:.45rem .65rem;border:1px solid #ddd;border-radius:8px;font:inherit">
                    <div class="cn-dd-label">النوع</div>
                    <div class="cn-chips" id="client-kind-chips" style="margin-bottom:.5rem">
                      ${chip("", "الكل", !kind)}
                      ${chip("forms", "نماذج", kind === "forms")}
                      ${chip("attachments", "مرفقات", kind === "attachments")}
                      ${chip("images", "صور", kind === "images")}
                      ${chip("files", "ملفات", kind === "files")}
                    </div>
                    <div class="cn-dd-label">الترتيب</div>
                    <select id="client-thread-sort" style="width:100%;font:inherit;padding:.35rem .45rem;border-radius:8px;border:1px solid #ddd;margin-bottom:.5rem">
                      <option value="newest" ${sort === "newest" ? "selected" : ""}>الأحدث / الأسرع</option>
                      <option value="oldest" ${sort === "oldest" ? "selected" : ""}>الأقدم</option>
                    </select>
                    <button type="button" class="btn btn-sm" id="client-list-clear" style="width:100%">مسح التصفية</button>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" id="client-new-thread">${isAdmin ? "رسالة للعميل" : "رسالة جديدة"}</button>
              </div>
            </div>
            <div class="thread-list" id="client-thread-list">
              ${threads.length ? threads.map((t) => {
                const last = t.messages?.[t.messages.length - 1];
                const marks = [];
                if ((t.messages || []).some((m) => ClientBridge.messageHasForm(m))) marks.push("نموذج");
                if ((t.messages || []).some((m) => ClientBridge.messageHasImages(m))) marks.push("صور");
                else if ((t.messages || []).some((m) => ClientBridge.messageHasAttachments(m))) marks.push("مرفق");
                const unread = unreadOf(t);
                return `
                <button type="button" class="thread-item ${selected?.id === t.id ? "active" : ""} ${unread ? "unread" : ""}" data-thread="${t.id}">
                  <strong>${t.subject}</strong>
                  <span class="muted">${ClientBridge.statusLabel(t.status)} · ${ClientBridge.typeLabel(t.type)}
                    ${marks.length ? ` · ${marks.join(" · ")}` : ""}</span>
                  ${t.relatedTo?.label ? `<span class="muted">مربوط: ${t.relatedTo.label}</span>` : ""}
                  ${unread ? `<span class="badge badge-warn">${unread} غير مقروء</span>` : `<span class="muted">تمت القراءة</span>`}
                  ${last ? `<span class="muted">${(last.text || last.form?.title || last.kind || "").toString().slice(0, 40)}</span>` : ""}
                </button>`;
              }).join("") : `<p class="muted" style="padding:1rem">لا نتائج مطابقة للبحث أو التصفية</p>`}
            </div>
          </div>
          <div class="panel" style="min-height:480px">
            ${selected ? `
              <div class="panel-head">
                <div>
                  <h3>${selected.subject}</h3>
                  <p>${ClientBridge.statusLabel(selected.status)}
                    ${selected.relatedTo?.label ? ` · مرتبط بـ ${selected.relatedTo.label}` : ""}
                    · ${(chatQ || chatKind) ? `عرض ${chatMsgs.length} من ${selected.messages.length}` : `${selected.messages.length} رسالة`}
                  </p>
                </div>
                <div style="display:flex;gap:.4rem;align-items:center">
                  ${isAdmin && selected.status !== "closed" ? `<button type="button" class="btn btn-sm btn-secondary" id="client-close-thread">إغلاق</button>` : ""}
                  <div class="cn-dd">
                    <button type="button" class="btn btn-sm cn-dd-btn ${chatOpen || chatActive ? "open has-filter" : ""}" id="client-chat-dd-btn" aria-expanded="${chatOpen ? "true" : "false"}">
                      ⌕ بحث ${chatActive ? '<span class="cn-dd-dot"></span>' : ""}
                    </button>
                    <div class="cn-dd-menu cn-dd-menu-end" id="client-chat-dd-menu" ${chatOpen ? "" : "hidden"}>
                      <div class="cn-dd-title">بحث داخل المحادثة</div>
                      <input type="search" id="client-chat-search" value="${esc(chatQ)}"
                        placeholder="نص الرسالة أو اسم المرفق..."
                        style="width:100%;margin-bottom:.5rem;padding:.45rem .65rem;border:1px solid #ddd;border-radius:8px;font:inherit">
                      <div class="cn-dd-label">تصفية سريعة</div>
                      <div class="cn-chips" id="client-chat-chips" style="margin-bottom:.5rem">
                        ${chip("", "الكل", !chatKind)}
                        ${chip("forms", "نماذج", chatKind === "forms")}
                        ${chip("attachments", "مرفقات", chatKind === "attachments")}
                        ${chip("images", "صور", chatKind === "images")}
                        ${chip("files", "ملفات", chatKind === "files")}
                      </div>
                      <button type="button" class="btn btn-sm" id="client-chat-clear" style="width:100%">مسح التصفية</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="psr-chat" id="chat-box" style="margin:0 1rem 1rem">
                ${chatMsgs.length
                  ? chatMsgs.map((m) => ClientBridge.renderMessage(m, side)).join("")
                  : `<p class="muted" style="padding:1rem;text-align:center">لا رسائل مطابقة داخل المحادثة</p>`}
              </div>
              ${selected.status !== "closed" ? `<div style="padding:0 1rem 1rem">${ClientBridge.composeBarHtml(composePrefix)}</div>` : `<p class="muted" style="padding:1rem">المحادثة مغلقة</p>`}
            ` : `<div class="panel-head"><div><h3>اختر محادثة</h3><p>أو أنشئ رسالة جديدة</p></div></div>`}
          </div>
        </div>
    `;
  },

  messages() {
    return `
      <section class="view">
        ${this.messagesInner("client")}
      </section>
    `;
  },

  usersInner() {
    return `
        <div class="grid-2 plat-users" style="align-items:start;gap:1rem">
          <div class="panel">
            <div class="panel-head">
              <div><h3>مستخدمو العميل</h3><p>الاسم · كلمة المرور · البريد الإلكتروني</p></div>
              <button class="btn btn-primary btn-sm" id="add-user">إضافة مستخدم</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>اسم العميل</th><th>البريد الإلكتروني</th><th>كلمة المرور</th><th>الدور</th><th></th></tr></thead>
                <tbody id="users-body">
                  ${AppData.users.map((u, i) => `
                    <tr>
                      <td>${u.name}</td>
                      <td>${u.email}</td>
                      <td>${u.password}</td>
                      <td><span class="badge badge-info">${u.role}</span></td>
                      <td><button class="btn btn-danger btn-sm del-user" data-index="${i}">حذف</button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="panel">
            <div class="panel-head"><div><h3>حساب الدخول الحالي</h3><p>بيانات الدخول للمنصة وبوابة العميل</p></div></div>
            <form class="form-grid" id="client-account-form">
              <label><span>اسم العميل</span><input name="name" value="${AppData.client.name}" required /></label>
              <label><span>البريد الإلكتروني</span><input name="email" type="email" value="${AppData.client.email}" required /></label>
              <label><span>كلمة المرور</span><input name="password" type="text" value="${AppData.client.password}" required /></label>
              <div class="full actions-row">
                <button type="submit" class="btn btn-primary">حفظ بيانات الحساب</button>
              </div>
            </form>
          </div>
        </div>
    `;
  },

  users() {
    return `
      <section class="view">
        ${this.usersInner()}
      </section>
    `;
  },

  digital() {
    const navGroups = [
      {
        id: "dash",
        label: "لوحة التحكم",
        ico: "bi-speedometer2",
        items: [
          { id: "home", ico: "bi-house-door-fill", label: "الرئيسية", tone: "gold" },
        ],
      },
      {
        id: "ops",
        label: "التشغيل الميداني",
        ico: "bi-geo",
        items: [
          { id: "sites", ico: "bi-geo-alt", label: "المواقع", tone: "blue" },
          { id: "staff", ico: "bi-people", label: "أفراد الأمن", tone: "teal" },
          { id: "attendance", ico: "bi-clock-history", label: "الحضور والانصراف", tone: "green" },
          { id: "tours", ico: "bi-signpost-2", label: "الجولات الميدانية", tone: "purple" },
        ],
      },
      {
        id: "sec",
        label: "الأمن والبلاغات",
        ico: "bi-shield-check",
        items: [
          { id: "alerts", ico: "bi-bell", label: "البلاغات والحوادث", tone: "red" },
          { id: "emergency", ico: "bi-shield-exclamation", label: "إدارة الطوارئ", tone: "orange" },
        ],
      },
      {
        id: "perf",
        label: "الأداء والتقارير",
        ico: "bi-graph-up-arrow",
        items: [
          { id: "kpi", ico: "bi-bar-chart-line", label: "مؤشرات الأداء", tone: "cyan" },
          { id: "reports", ico: "bi-file-earmark-text", label: "التقارير التنفيذية", tone: "navy" },
          { id: "photos", ico: "bi-camera", label: "التوثيق بالصور", tone: "pink" },
        ],
      },
      {
        id: "apps",
        label: "التطبيقات",
        ico: "bi-phone",
        items: [
          { id: "mobile", ico: "bi-phone", label: "تطبيق الجوال", tone: "lime" },
        ],
      },
      {
        id: "comms",
        label: "التعاقد والمتابعة",
        ico: "bi-chat-dots",
        items: [
          { id: "messages", ico: "bi-chat-dots", label: "التواصل والإشعارات", tone: "teal" },
        ],
      },
      {
        id: "account",
        label: "الحساب",
        ico: "bi-person",
        items: [
          { id: "users", ico: "bi-person", label: "مستخدمو العميل", tone: "navy" },
        ],
      },
    ];
    const activePanel = sessionStorage.getItem("digital_panel") || "home";

    const sites = AppData.projects.length;
    const personnel = 128;
    const attendanceRate = 98;
    const achievement = 92;
    const alerts = AppData.fieldAlerts;
    const sNew = alerts.filter((a) => a.status === "مفتوح").length;
    const sProc = alerts.filter((a) => a.status === "قيد المعالجة").length;
    const sClosed = alerts.filter((a) => a.status === "مغلق").length;
    const sDone = Math.max(sClosed - 1, 1);
    const sumStatus = sNew + sProc + sDone + sClosed || 1;
    const p1 = (sNew / sumStatus) * 100;
    const p2 = (sProc / sumStatus) * 100;
    const p3 = (sDone / sumStatus) * 100;
    const totalAlerts = alerts.length;

    const byType = [
      { label: "أمنية", count: alerts.filter((a) => a.type === "أمني" || a.type === "طوارئ").length || 3, color: "#5b8def" },
      { label: "سلامة", count: alerts.filter((a) => a.type === "ميداني").length || 2, color: "#e05b5b" },
      { label: "ممتلكات", count: alerts.filter((a) => a.type === "صيانة").length || 2, color: "#c8a15a" },
      { label: "أخرى", count: alerts.filter((a) => a.type === "تشغيلي").length || 1, color: "#3db88a" },
    ];
    const typeMax = Math.max(...byType.map((t) => t.count), 1);

    const kpiMonths = [
      { m: "يناير", v: 72 }, { m: "فبراير", v: 78 }, { m: "مارس", v: 74 },
      { m: "أبريل", v: 85 }, { m: "مايو", v: 88 }, { m: "يونيو", v: 94 },
    ];
    const linePoints = kpiMonths.map((k, i) => {
      const x = (i / (kpiMonths.length - 1)) * 100;
      const y = 100 - k.v;
      return `${x},${y}`;
    }).join(" ");

    const activities = [
      { time: "10:30", text: "جولة دورية — متحف حي الثقافة", tone: "warn" },
      { time: "09:45", text: "بلاغ أمني — متحف وبلاد الصافية", tone: "danger" },
      { time: "08:15", text: "تفتيش مدخل — متحف حي الثقافة", tone: "ok" },
      { time: "07:50", text: "جولة مفاجئة — متحف وبلاد الصافية", tone: "ok" },
    ];

    const services = [
      { ico: "bi-fingerprint", title: "الحضور الذكي", points: ["تسجيل الحضور والانصراف", "التحقق من الموقع", "متابعة الالتزام"], tone: "green" },
      { ico: "bi-broadcast", title: "غرفة العمليات", points: ["متابعة جميع المواقع", "استقبال البلاغات", "إدارة الأحداث"], tone: "blue" },
      { ico: "bi-geo-alt", title: "الرقابة الميدانية", points: ["الجولات الإلكترونية", "نماذج التفتيش", "متابعة الملاحظات"], tone: "teal" },
      { ico: "bi-exclamation-octagon", title: "إدارة البلاغات", points: ["تسجيل البلاغات", "متابعة المعالجة", "إغلاق البلاغ"], tone: "red" },
      { ico: "bi-speedometer2", title: "مؤشرات الأداء KPI", points: ["نسب الالتزام", "الحضور", "جودة الأداء", "الاستجابة"], tone: "gold" },
      { ico: "bi-file-earmark-bar-graph", title: "التقارير", points: ["يومية", "أسبوعية", "شهرية", "تنفيذية"], tone: "purple" },
      { ico: "bi-shield-exclamation", title: "إدارة المخاطر", points: ["رصد المخاطر", "إجراءات المعالجة", "متابعة التنفيذ"], tone: "orange" },
      { ico: "bi-display", title: "لوحة العميل", points: ["متابعة المواقع", "مشاهدة التقارير", "مؤشرات الأداء", "البلاغات والملاحظات"], tone: "cyan" },
    ];

    const features = ["متابعة لحظية", "بيانات دقيقة", "رقابة إلكترونية", "تقارير فورية", "سرعة اتخاذ القرار", "رفع جودة التشغيل"];
    const strip = [
      { ico: "📍", text: "متابعة لحظية" },
      { ico: "📊", text: "مؤشرات الأداء" },
      { ico: "📱", text: "تطبيقات ذكية" },
      { ico: "📋", text: "تقارير تنفيذية" },
      { ico: "🛡️", text: "رقابة رقمية" },
      { ico: "⚡", text: "استجابة أسرع" },
    ];

    return `
      <section class="view digital-view digital-view-tight">
        <div class="platform-frame" aria-label="منصة التشغيل الأمنية">
          <aside class="platform-nav" id="platform-aside">
            <nav id="platform-nav" class="platform-nav-tree">
              ${navGroups.map((g) => `
                <div class="nav-section${g.items.some((i) => i.id === activePanel) ? " has-active" : ""}" data-nav-group="${g.id}">
                  <div class="nav-section-title">${g.label}</div>
                  <div class="nav-section-items">
                    ${g.items.map((n) => `
                      <button type="button" class="platform-nav-item${activePanel === n.id ? " active" : ""}" data-platform-panel="${n.id}">
                        <span>${n.label}${n.id === "messages" ? '<span class="nav-badge plat-msg-badge" id="digitalMsgBadge" hidden>0</span>' : ""}</span>
                        <span class="platform-nav-ico"><i class="bi ${n.ico}"></i></span>
                      </button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </nav>
          </aside>

          <div class="platform-main platform-main-dash">
            <div class="platform-panel${activePanel === "home" ? " active" : ""}" data-platform-panel="home">
            <div class="control-dash control-dash-day">
              <div class="control-head">
                <div>
                  <p class="control-kicker">لوحة التحكم الرئيسية</p>
                  <h3 class="client-gold">تناهي للاستثمار</h3>
                  <p class="control-sites"><span>متحف حي الثقافة</span><span>متحف وبلاد الصافية</span></p>
                </div>
              </div>

              <div class="control-kpi-row">
                <div class="control-kpi kpi-blue">
                  <div class="control-kpi-ico"><i class="bi bi-geo-alt-fill"></i></div>
                  <div><span>إجمالي المواقع</span><strong>${sites}</strong></div>
                </div>
                <div class="control-kpi kpi-teal">
                  <div class="control-kpi-ico"><i class="bi bi-people-fill"></i></div>
                  <div><span>إجمالي أفراد الأمن</span><strong>${personnel.toLocaleString("en-US")}</strong></div>
                </div>
                <div class="control-kpi control-kpi-ring kpi-green">
                  <div class="control-ring teal" style="--p:${attendanceRate}"><span>${attendanceRate}%</span></div>
                  <div><span>الحماية اليوم</span><strong>نسبة الحضور</strong></div>
                </div>
                <div class="control-kpi control-kpi-ring kpi-gold">
                  <div class="control-ring gold" style="--p:${achievement}"><span>${achievement}%</span></div>
                  <div><span>نسبة الالتزام</span><strong>نسبة الإنجاز</strong></div>
                </div>
              </div>

              <div class="control-mid">
                <div class="control-card platform-map-card">
                  <div class="control-card-head">
                    <h4>خريطة المواقع</h4>
                    <div class="map-tools">
                      <button type="button" class="map-tool-btn" id="map-fit" title="عرض الكل"><i class="bi bi-fullscreen"></i></button>
                      <button type="button" class="btn btn-sm control-link platform-goto" data-platform-panel="alerts">البلاغات</button>
                    </div>
                  </div>
                  <div class="control-map" id="digital-ops-map"></div>
                  <div class="map-site-card" id="map-site-card" hidden>
                    <button type="button" class="map-site-close" id="map-site-close" aria-label="إغلاق">×</button>
                    <h5 id="map-site-name"></h5>
                    <div class="map-site-stats">
                      <span><b id="map-site-guards"></b> حارس</span>
                      <span><b id="map-site-present"></b> حضور</span>
                      <span><b id="map-site-status"></b></span>
                    </div>
                  </div>
                </div>

                <div class="control-card">
                  <div class="control-card-head">
                    <h4>الحوادث والحالات</h4>
                    <button type="button" class="btn btn-sm control-link platform-goto" data-platform-panel="alerts">التفاصيل</button>
                  </div>
                  <div class="control-incident">
                    <div class="control-donut" style="--a:${p1}%; --b:${p1 + p2}%; --c:${p1 + p2 + p3}%">
                      <div class="control-donut-center">
                        <strong>${totalAlerts}</strong>
                        <span>بلاغ</span>
                      </div>
                    </div>
                    <ul class="control-legend">
                      <li><i style="background:#5b8def"></i> جديد <b>${sNew}</b></li>
                      <li><i style="background:#e05b5b"></i> قيد المعالجة <b>${sProc}</b></li>
                      <li><i style="background:#c8a15a"></i> تم الحل <b>${sDone}</b></li>
                      <li><i style="background:#3db88a"></i> مغلق <b>${sClosed}</b></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="control-bottom">
                <div class="control-card">
                  <div class="control-card-head"><h4>مؤشرات الأداء الرئيسية</h4></div>
                  <div class="control-line-wrap">
                    <svg class="control-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <linearGradient id="kpiFillDigital" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="rgba(200,161,90,.35)"/>
                          <stop offset="100%" stop-color="rgba(200,161,90,0)"/>
                        </linearGradient>
                      </defs>
                      <polyline fill="url(#kpiFillDigital)" stroke="none" points="0,100 ${linePoints} 100,100"></polyline>
                      <polyline fill="none" stroke="#c8a15a" stroke-width="2.2" points="${linePoints}"></polyline>
                    </svg>
                    <div class="control-line-labels">
                      ${kpiMonths.map((k) => `<span>${k.m}</span>`).join("")}
                    </div>
                  </div>
                </div>

                <div class="control-card">
                  <div class="control-card-head"><h4>الحوادث حسب النوع</h4></div>
                  <div class="control-hbar">
                    ${byType.map((t) => `
                      <div class="control-hbar-row">
                        <span>${t.label}</span>
                        <div class="control-hbar-track"><i style="width:${Math.round((t.count / typeMax) * 100)}%;background:${t.color}"></i></div>
                        <b>${t.count}</b>
                      </div>
                    `).join("")}
                  </div>
                </div>

                <div class="control-card">
                  <div class="control-card-head"><h4>أحدث الأنشطة</h4></div>
                  <ul class="control-activity">
                    ${activities.map((a) => `
                      <li>
                        <i class="tone-${a.tone}"></i>
                        <div>
                          <strong>${a.time}</strong>
                          <p>${a.text}</p>
                        </div>
                      </li>
                    `).join("")}
                  </ul>
                </div>
              </div>
            </div>
            </div>

            <div class="platform-panel${activePanel === "sites" ? " active" : ""}" data-platform-panel="sites">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>المواقع</h3>
                  <p>مواقع تناهي للاستثمار تحت التشغيل</p>
                </div>
                <div class="plat-grid-2">
                  ${AppData.projects.map((p, i) => `
                    <article class="plat-card site-card tone-${i === 0 ? "blue" : "gold"}">
                      <div class="plat-card-ico"><i class="bi bi-geo-alt-fill"></i></div>
                      <h4 class="client-gold">${p.name}</h4>
                      <ul>
                        <li>الحالة: <b>${p.status}</b></li>
                        <li>عدد الحراس: <b>${p.guards}</b></li>
                        <li>المدينة: <b>${p.site}</b></li>
                        <li>الرمز: <b>${p.id}</b></li>
                      </ul>
                      <div class="plat-card-actions">
                        <button type="button" class="btn btn-primary btn-sm platform-goto" data-platform-panel="alerts">البلاغات</button>
                        <button type="button" class="btn btn-secondary btn-sm platform-goto" data-platform-panel="attendance">الحضور</button>
                      </div>
                    </article>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "staff" ? " active" : ""}" data-platform-panel="staff">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>أفراد الأمن</h3>
                  <p>القوة العاملة في مواقع تناهي</p>
                </div>
                <div class="table-wrap plat-table">
                  <table>
                    <thead><tr><th>الاسم</th><th>الدور</th><th>الموقع</th><th>الوردية</th><th>الحالة</th></tr></thead>
                    <tbody>
                      ${AppData.employees.map((e) => `
                        <tr>
                          <td>${e.name}</td>
                          <td>${e.role}</td>
                          <td>${e.project}</td>
                          <td>${e.shift}</td>
                          <td><span class="badge badge-ok">على رأس العمل</span></td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "attendance" ? " active" : ""}" data-platform-panel="attendance">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>الحضور والانصراف</h3>
                  <p>متابعة لحظية للوردية الحالية</p>
                </div>
                <div class="ops-kpi-row" style="margin-bottom:1rem">
                  <div class="ops-kpi-card"><div class="ops-kpi-ico"><i class="bi bi-person-check"></i></div><div><span class="label">حاضر</span><strong>${AppData.attendance.filter((a) => a.status === "حاضر").length}</strong></div></div>
                  <div class="ops-kpi-card"><div class="ops-kpi-ico"><i class="bi bi-box-arrow-right"></i></div><div><span class="label">انصرف</span><strong>${AppData.attendance.filter((a) => a.status === "انصرف").length}</strong></div></div>
                  <div class="ops-kpi-card"><div class="ops-kpi-ico"><i class="bi bi-person-x"></i></div><div><span class="label">غائب</span><strong>${AppData.attendance.filter((a) => a.status === "غائب").length}</strong></div></div>
                  <div class="ops-kpi-card"><div class="ops-kpi-ico"><i class="bi bi-percent"></i></div><div><span class="label">الالتزام</span><strong>98%</strong></div></div>
                </div>
                <div class="table-wrap plat-table">
                  <table>
                    <thead><tr><th>الاسم</th><th>الموقع</th><th>دخول</th><th>خروج</th><th>الوردية</th><th>الحالة</th></tr></thead>
                    <tbody>
                      ${AppData.attendance.map((a) => `
                        <tr>
                          <td>${a.name}</td>
                          <td>${a.project}</td>
                          <td>${a.in}</td>
                          <td>${a.out}</td>
                          <td>${a.shift}</td>
                          <td><span class="badge ${a.status === "حاضر" ? "badge-ok" : a.status === "غائب" ? "badge-danger" : "badge-warn"}">${a.status}</span></td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "tours" ? " active" : ""}" data-platform-panel="tours">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>الجولات الميدانية</h3>
                  <p>سجل الجولات الإلكترونية والتفتيش</p>
                </div>
                <div class="list-stack plat-list">
                  <div class="list-item"><span class="dot" style="background:var(--ok)"></span><div class="body"><strong>جولة صباحية — متحف حي الثقافة</strong><p>اكتملت 12/12 نقطة تفتيش</p></div><span class="badge badge-ok">مكتملة</span></div>
                  <div class="list-item"><span class="dot" style="background:var(--gold)"></span><div class="body"><strong>جولة مسائية — متحف وبلاد الصافية</strong><p>قيد التنفيذ · 7/10 نقاط</p></div><span class="badge badge-warn">جارية</span></div>
                  <div class="list-item"><span class="dot" style="background:var(--ok)"></span><div class="body"><strong>جولة مفاجئة — متحف حي الثقافة</strong><p>لا ملاحظات · زمن الاستجابة 4 د</p></div><span class="badge badge-ok">مكتملة</span></div>
                  <div class="list-item"><span class="dot" style="background:var(--danger)"></span><div class="body"><strong>جولة ليلية — متحف وبلاد الصافية</strong><p>ملاحظة إضاءة في الممر الغربي</p></div><span class="badge badge-danger">ملاحظة</span></div>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "alerts" ? " active" : ""}" data-platform-panel="alerts">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>البلاغات والحوادث</h3>
                  <p>لوحة متابعة البلاغات لمواقع تناهي للاستثمار — حي الثقافة وبلاد الصافية</p>
                </div>
                ${this.reportsInner()}
              </div>
            </div>

            <div class="platform-panel${activePanel === "emergency" ? " active" : ""}" data-platform-panel="emergency">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>إدارة الطوارئ</h3>
                  <p>جاهزية الاستجابة وبروتوكولات الطوارئ</p>
                </div>
                <div class="plat-grid-2">
                  <article class="plat-card">
                    <h4>متحف حي الثقافة</h4>
                    <ul>
                      <li>تغطية الطوارئ: <b>100%</b></li>
                      <li>فريق الاستجابة: <b>جاهز</b></li>
                      <li>آخر تمرين: <b>2026-07-18</b></li>
                      <li>وقت الاستجابة المستهدف: <b>3 د</b></li>
                    </ul>
                  </article>
                  <article class="plat-card">
                    <h4>متحف وبلاد الصافية</h4>
                    <ul>
                      <li>تغطية الطوارئ: <b>100%</b></li>
                      <li>فريق الاستجابة: <b>جاهز</b></li>
                      <li>آخر تمرين: <b>2026-07-20</b></li>
                      <li>وقت الاستجابة المستهدف: <b>3 د</b></li>
                    </ul>
                  </article>
                </div>
                <div class="list-stack plat-list" style="margin-top:1rem">
                  <div class="list-item"><span class="dot" style="background:var(--ok)"></span><div class="body"><strong>لا بلاغات طوارئ مفتوحة حاليًا</strong><p>جميع أنظمة الإنذار طبيعية</p></div><span class="badge badge-ok">مستقر</span></div>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "kpi" ? " active" : ""}" data-platform-panel="kpi">
              <div class="plat-section control-dash-day kpi-dash">
                <div class="plat-section-head kpi-dash-head">
                  <div>
                    <h3>مؤشرات الأداء</h3>
                    <p>لوحة KPIs تشغيلية — تناهي للاستثمار</p>
                  </div>
                  <div class="kpi-score-chip">
                    <span>التقييم العام</span>
                    <strong>4.8</strong>
                    <em>ممتاز</em>
                  </div>
                </div>

                <div class="kpi-summary-row">
                  ${[
                    { label: "نسبة الحضور", value: 98, target: 95, unit: "%", tone: "green", tip: "أعلى من المستهدف" },
                    { label: "تغطية الجولات", value: 95, target: 92, unit: "%", tone: "blue", tip: "ضمن النطاق" },
                    { label: "جودة التقارير", value: 97, target: 90, unit: "%", tone: "gold", tip: "أداء مرتفع" },
                    { label: "جاهزية الحراس", value: 100, target: 98, unit: "%", tone: "teal", tip: "مكتمل" },
                  ].map((k) => `
                    <article class="kpi-meter tone-${k.tone}">
                      <div class="kpi-meter-top">
                        <span>${k.label}</span>
                        <b>${k.value}${k.unit}</b>
                      </div>
                      <div class="kpi-meter-bar"><i style="width:${k.value}%"></i></div>
                      <div class="kpi-meter-foot">
                        <span>المستهدف ${k.target}${k.unit}</span>
                        <em>${k.tip}</em>
                      </div>
                    </article>
                  `).join("")}
                </div>

                <div class="kpi-mid-grid">
                  <div class="kpi-panel-card">
                    <div class="kpi-panel-head">
                      <h4>مقارنة المواقع</h4>
                      <span>هذا الشهر</span>
                    </div>
                    <div class="kpi-site-compare">
                      ${[
                        {
                          name: "متحف حي الثقافة",
                          tone: "blue",
                          rows: [
                            { l: "الحضور", v: 99 },
                            { l: "الجولات", v: 96 },
                            { l: "الاستجابة", v: 94 },
                            { l: "الجودة", v: 98 },
                          ],
                        },
                        {
                          name: "متحف وبلاد الصافية",
                          tone: "gold",
                          rows: [
                            { l: "الحضور", v: 97 },
                            { l: "الجولات", v: 94 },
                            { l: "الاستجابة", v: 91 },
                            { l: "الجودة", v: 96 },
                          ],
                        },
                      ].map((site) => `
                        <div class="kpi-site-box tone-${site.tone}">
                          <h5>${site.name}</h5>
                          ${site.rows.map((r) => `
                            <div class="kpi-site-row">
                              <span>${r.l}</span>
                              <div class="kpi-meter-bar sm"><i style="width:${r.v}%"></i></div>
                              <b>${r.v}%</b>
                            </div>
                          `).join("")}
                        </div>
                      `).join("")}
                    </div>
                  </div>

                  <div class="kpi-panel-card">
                    <div class="kpi-panel-head">
                      <h4>اتجاه الأداء الشهري</h4>
                      <span>يناير — يونيو</span>
                    </div>
                    <div class="kpi-trend">
                      <svg viewBox="0 0 100 55" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="kpiTrendFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="rgba(91,141,239,.35)"/>
                            <stop offset="100%" stop-color="rgba(91,141,239,0)"/>
                          </linearGradient>
                        </defs>
                        <polyline fill="url(#kpiTrendFill)" points="0,55 ${linePoints.split(" ").map((pt) => { const [x,y] = pt.split(","); return `${x},${(Number(y) * 0.55).toFixed(1)}`; }).join(" ")} 100,55"></polyline>
                        <polyline fill="none" stroke="#5b8def" stroke-width="2.4" points="${linePoints.split(" ").map((pt) => { const [x,y] = pt.split(","); return `${x},${(Number(y) * 0.55).toFixed(1)}`; }).join(" ")}"></polyline>
                        <polyline fill="none" stroke="#c8a15a" stroke-width="2" stroke-dasharray="3 2" points="${kpiMonths.map((k, i) => `${(i / (kpiMonths.length - 1)) * 100},${(100 - (k.v - 4)) * 0.55}`).join(" ")}"></polyline>
                      </svg>
                      <div class="kpi-trend-legend">
                        <span><i style="background:#5b8def"></i> الإنجاز الفعلي</span>
                        <span><i style="background:#c8a15a"></i> المستهدف</span>
                      </div>
                      <div class="control-line-labels">
                        ${kpiMonths.map((k) => `<span>${k.m}</span>`).join("")}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="kpi-bottom-grid">
                  <div class="kpi-panel-card">
                    <div class="kpi-panel-head"><h4>مؤشرات الاستجابة والسلامة</h4></div>
                    <div class="kpi-stat-tiles">
                      <div class="kpi-tile tone-green"><strong>2.3 د</strong><span>متوسط الاستجابة</span><em>الهدف ≤ 3 د</em></div>
                      <div class="kpi-tile tone-blue"><strong>0</strong><span>حوادث حرجة مفتوحة</span><em>وضع مستقر</em></div>
                      <div class="kpi-tile tone-gold"><strong>12</strong><span>بلاغات هذا الأسبوع</span><em>${sClosed} مغلق</em></div>
                      <div class="kpi-tile tone-teal"><strong>95%</strong><span>اكتمال الجولات</span><em>اليوم</em></div>
                    </div>
                  </div>

                  <div class="kpi-panel-card">
                    <div class="kpi-panel-head"><h4>حالة المؤشرات</h4></div>
                    <ul class="kpi-status-list">
                      <li><i class="ok"></i><div><strong>الحضور والالتزام</strong><p>فوق المستهدف في الموقعين</p></div><span class="badge badge-ok">ممتاز</span></li>
                      <li><i class="ok"></i><div><strong>الجولات الميدانية</strong><p>تغطية عالية مع ملاحظة طفيفة بالصافية</p></div><span class="badge badge-ok">جيد جدًا</span></li>
                      <li><i class="warn"></i><div><strong>زمن الاستجابة</strong><p>ضمن الهدف مع فرصة تحسين مسائي</p></div><span class="badge badge-warn">متابعة</span></li>
                      <li><i class="ok"></i><div><strong>جودة التقارير</strong><p>اكتمال التوثيق والصور التشغيلية</p></div><span class="badge badge-ok">ممتاز</span></li>
                    </ul>
                  </div>
                </div>

                <div class="kpi-actions">
                  <button type="button" class="btn btn-primary btn-sm platform-goto" data-platform-panel="reports">عرض التقارير التنفيذية</button>
                  <button type="button" class="btn btn-secondary btn-sm platform-goto" data-platform-panel="alerts">مراجعة البلاغات</button>
                  <button type="button" class="btn btn-secondary btn-sm platform-goto" data-platform-panel="home">العودة للرئيسية</button>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "reports" ? " active" : ""}" data-platform-panel="reports">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>التقارير التنفيذية</h3>
                  <p>تقارير يومية وأسبوعية للمواقع</p>
                </div>
                <div class="table-wrap plat-table">
                  <table>
                    <thead><tr><th>التاريخ</th><th>الموقع</th><th>الملخص</th><th>المُعد</th></tr></thead>
                    <tbody>
                      ${AppData.dailyReports.map((r) => `
                        <tr><td>${r.date}</td><td>${r.project}</td><td>${r.summary}</td><td>${r.author}</td></tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "photos" ? " active" : ""}" data-platform-panel="photos">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>التوثيق بالصور</h3>
                  <p>أرشيف مرئي للجولات والبلاغات</p>
                </div>
                <div class="plat-photos">
                  ${[
                    { title: "مدخل متحف حي الثقافة", tag: "جولة" },
                    { title: "نقطة تفتيش الصافية", tag: "تفتيش" },
                    { title: "بلاغ إضاءة — الثقافة", tag: "بلاغ" },
                    { title: "ساحة الزوار — الصافية", tag: "جولة" },
                    { title: "غرفة المراقبة", tag: "تشغيل" },
                    { title: "البوابة الشرقية", tag: "تفتيش" },
                  ].map((p) => `
                    <div class="plat-photo">
                      <div class="plat-photo-art"><i class="bi bi-image"></i></div>
                      <strong>${p.title}</strong>
                      <span>${p.tag}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <div class="platform-panel${activePanel === "mobile" ? " active" : ""}" data-platform-panel="mobile">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>تطبيق الجوال</h3>
                  <p>محاكاة كاملة مع آلية تحضير وخيارات أدوار ومواقع وسيناريوهات تشغيل — حارس · مشرف · عميل</p>
                </div>
                ${typeof MobileSim !== "undefined" ? MobileSim.shellHtml() : `<p class="muted">تعذر تحميل محاكاة التطبيق</p>`}
              </div>
            </div>

            <div class="platform-panel${activePanel === "messages" ? " active" : ""}" data-platform-panel="messages">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>التواصل والإشعارات</h3>
                  <p>غرفة سنام مع عميل تناهي — إرسال وردود ونماذج، مرتبطة مباشرة ببوابة العميل</p>
                </div>
                ${typeof ClientBridge !== "undefined" ? this.messagesInner("admin") : `<p class="muted">تعذر تحميل نظام التواصل</p>`}
              </div>
            </div>

            <div class="platform-panel${activePanel === "users" ? " active" : ""}" data-platform-panel="users">
              <div class="plat-section control-dash-day">
                <div class="plat-section-head">
                  <h3>مستخدمو العميل</h3>
                  <p>إدارة حسابات الدخول لبوابة العميل ومنصة التحول الرقمي</p>
                </div>
                ${this.usersInner()}
              </div>
            </div>
          </div>
        </div>

        <div class="digital-services">
          ${services.map((s) => `
            <article class="digital-card tone-${s.tone}">
              <div class="digital-card-ico"><i class="bi ${s.ico}"></i></div>
              <h4>${s.title}</h4>
              <ul>${s.points.map((p) => `<li>${p}</li>`).join("")}</ul>
            </article>
          `).join("")}
        </div>

        <ul class="feature-pills">
          ${features.map((f) => `<li><span>✓</span> ${f}</li>`).join("")}
        </ul>

        <div class="digital-strip" role="list">
          ${strip.map((s) => `
            <div class="digital-strip-item" role="listitem">
              <span>${s.ico}</span>
              <strong>${s.text}</strong>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  },
};
