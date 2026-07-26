/* ============================================
   جسر تواصل العميل ↔ سنام للحراسات الأمنية
   مرفقات · صور · صوت · نماذج · مقروء/غير مقروء
   ============================================ */

const ClientBridge = {
  KEY: 'psr_client_threads',
  FORM_TPL_KEY: 'psr_client_form_templates',
  CLIENT_ID: 'client-demo',
  MAX_FILE_BYTES: 900000,
  MAX_IMAGE_EDGE: 1280,

  getStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.KEY));
      if (raw && Array.isArray(raw.threads)) return raw;
    } catch (_) { /* ignore */ }
    return { threads: [], version: 2 };
  },

  saveStore(store) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(store));
    } catch (e) {
      console.warn('ClientBridge save failed (storage full?)', e);
      throw e;
    }
    try {
      window.dispatchEvent(new CustomEvent('psr-client-threads', { detail: store }));
    } catch (_) { /* ignore */ }
  },

  _changeListeners: [],
  _changeBound: false,

  /** اشتراك في تغيّر المحادثات (نفس التبويب + تبويبات أخرى عبر localStorage) */
  subscribe(fn) {
    if (typeof fn !== 'function') return () => {};
    this._changeListeners.push(fn);
    if (!this._changeBound) {
      this._changeBound = true;
      window.addEventListener('storage', (e) => {
        if (e.key !== this.KEY && e.key !== this.FORM_TPL_KEY) return;
        this._emitChange('storage');
      });
      window.addEventListener('psr-client-threads', () => this._emitChange('local'));
    }
    return () => {
      this._changeListeners = this._changeListeners.filter((x) => x !== fn);
    };
  },

  _emitChange(source) {
    this._changeListeners.forEach((fn) => {
      try { fn(source); } catch (_) { /* ignore */ }
    });
  },

  seedIfEmpty() {
    const store = this.getStore();
    if (store.threads.length) {
      this._normalizeStore(store);
      return store;
    }
    const now = new Date().toISOString();
    store.threads = [
      {
        id: 'TH1',
        clientId: this.CLIENT_ID,
        clientName: 'تناهي للاستثمار',
        subject: 'طلب تعزيز مناوبة مسائية',
        type: 'message',
        status: 'awaiting_admin',
        relatedTo: { kind: 'project', ref: 'P-101', label: 'متحف حي الثقافة' },
        createdAt: now,
        updatedAt: now,
        unreadAdmin: 1,
        unreadClient: 0,
        messages: [
          {
            id: 'M1',
            from: 'client',
            who: 'عميل — تناهي للاستثمار',
            text: 'نرجو تأكيد توفر 3 حراس إضافيين نهاية الأسبوع للمجمع الشمالي.',
            at: now,
            kind: 'chat',
            attachments: [],
            form: null,
            readByAdmin: false,
            readByClient: true,
            readAdminAt: null,
            readClientAt: now
          }
        ]
      },
      {
        id: 'TH2',
        clientId: this.CLIENT_ID,
        clientName: 'تناهي للاستثمار',
        subject: 'طلب تعبئة نموذج اعتماد المناوبات',
        type: 'request',
        status: 'awaiting_client',
        relatedTo: { kind: 'contract', ref: 'CT-DEMO', label: 'عقد الحراسة 2026' },
        createdAt: now,
        updatedAt: now,
        unreadAdmin: 0,
        unreadClient: 1,
        messages: [
          {
            id: 'M2',
            from: 'admin',
            who: 'سنام للحراسات الأمنية',
            text: 'الرجاء تعبئة نموذج اعتماد جدول المناوبات وإرفاق المستند إن لزم.',
            at: now,
            kind: 'form',
            attachments: [],
            form: {
              id: 'F1',
              title: 'نموذج اعتماد المناوبات',
              fields: [
                { name: 'site', label: 'الموقع', type: 'text', required: true },
                { name: 'shifts', label: 'عدد الورديات', type: 'number', required: true },
                { name: 'date', label: 'تاريخ الاعتماد', type: 'date', required: true },
                { name: 'notes', label: 'ملاحظات', type: 'textarea', required: false }
              ],
              response: null,
              respondedAt: null
            },
            readByAdmin: true,
            readByClient: false,
            readAdminAt: now,
            readClientAt: null
          }
        ]
      }
    ];
    this.saveStore(store);
    return store;
  },

  _normalizeStore(store) {
    let changed = false;
    (store.threads || []).forEach(t => {
      (t.messages || []).forEach(m => {
        if (!Array.isArray(m.attachments)) { m.attachments = []; changed = true; }
        if (m.readByAdmin == null) {
          m.readByAdmin = m.from === 'admin';
          changed = true;
        }
        if (m.readByClient == null) {
          m.readByClient = m.from === 'client';
          changed = true;
        }
      });
    });
    if (changed) this.saveStore(store);
  },

  getThreads(clientId) {
    this.seedIfEmpty();
    const all = this.getStore().threads;
    if (!clientId) return all.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    return all
      .filter(t => t.clientId === clientId)
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  },

  getThread(id) {
    return this.getThreads().find(t => t.id === id) || null;
  },

  unreadForAdmin() {
    return this.getThreads().reduce((s, t) => s + (t.unreadAdmin || 0), 0);
  },

  unreadForClient(clientId) {
    return this.getThreads(clientId || this.CLIENT_ID).reduce((s, t) => s + (t.unreadClient || 0), 0);
  },

  messageHasForm(m) {
    return !!(m?.form || m?.kind === 'form' || m?.kind === 'form_response');
  },

  messageHasAttachments(m) {
    return Array.isArray(m?.attachments) && m.attachments.length > 0;
  },

  messageHasImages(m) {
    return (m?.attachments || []).some(a => a.kind === 'image' || /^image\//.test(a.mime || ''));
  },

  messageSearchText(m) {
    const parts = [
      m?.text || '',
      m?.who || '',
      m?.kind || '',
      m?.form?.title || '',
      ...(m?.form?.fields || []).map(f => f.label || ''),
      ...(m?.attachments || []).map(a => a.name || '')
    ];
    if (m?.form?.response) {
      parts.push(...Object.values(m.form.response).map(String));
    }
    return parts.join(' ').toLowerCase();
  },

  threadMatchesQuery(t, q) {
    if (!q) return true;
    const needle = String(q).trim().toLowerCase();
    if (!needle) return true;
    const hay = [
      t.subject || '',
      t.clientName || '',
      t.type || '',
      t.status || '',
      t.relatedTo?.label || '',
      ...(t.messages || []).map(m => this.messageSearchText(m))
    ].join(' ').toLowerCase();
    return hay.includes(needle);
  },

  threadHasKind(t, kind) {
    if (!kind) return true;
    const msgs = t.messages || [];
    if (kind === 'forms') return msgs.some(m => this.messageHasForm(m));
    if (kind === 'images') return msgs.some(m => this.messageHasImages(m));
    if (kind === 'attachments') return msgs.some(m => this.messageHasAttachments(m));
    if (kind === 'files') {
      return msgs.some(m => (m.attachments || []).some(a =>
        a.kind === 'file' || a.kind === 'audio' || (a.kind !== 'image' && !/^image\//.test(a.mime || ''))
      ));
    }
    return true;
  },

  filterThreads(list, { q = '', kind = '', status = '', sort = 'newest' } = {}) {
    let out = (list || []).slice();
    if (status === 'unread') out = out.filter(t => (t.unreadAdmin || t.unreadClient) > 0);
    if (status === 'unread_admin') out = out.filter(t => t.unreadAdmin > 0);
    if (status === 'unread_client') out = out.filter(t => t.unreadClient > 0);
    if (status === 'request') out = out.filter(t => t.type === 'request');
    if (status === 'awaiting_admin') out = out.filter(t => t.status === 'awaiting_admin');
    if (status === 'awaiting_client') out = out.filter(t => t.status === 'awaiting_client');
    if (kind) out = out.filter(t => this.threadHasKind(t, kind));
    if (q) out = out.filter(t => this.threadMatchesQuery(t, q));
    if (sort === 'oldest') {
      out.sort((a, b) => String(a.updatedAt || '').localeCompare(String(b.updatedAt || '')));
    } else {
      // الأحدث / الأسرع وصولاً
      out.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    }
    return out;
  },

  filterMessages(messages, { q = '', kind = '' } = {}) {
    return (messages || []).filter(m => {
      if (kind === 'forms' && !this.messageHasForm(m)) return false;
      if (kind === 'attachments' && !this.messageHasAttachments(m)) return false;
      if (kind === 'images' && !this.messageHasImages(m)) return false;
      if (kind === 'files') {
        const hasFile = (m.attachments || []).some(a => a.kind === 'file' || a.kind === 'audio');
        if (!hasFile) return false;
      }
      if (q && !this.messageSearchText(m).includes(String(q).trim().toLowerCase())) return false;
      return true;
    });
  },

  _timeLabel(iso) {
    const d = iso ? new Date(iso) : new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  },

  _dateLabel(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' });
  },

  _makeMsg({ from, who, text, kind, attachments, form }) {
    const at = new Date().toISOString();
    return {
      id: 'M' + Date.now() + Math.random().toString(16).slice(2, 5),
      from,
      who,
      text: text || '',
      at,
      kind: kind || 'chat',
      attachments: attachments || [],
      form: form || null,
      readByAdmin: from === 'admin',
      readByClient: from === 'client',
      readAdminAt: from === 'admin' ? at : null,
      readClientAt: from === 'client' ? at : null
    };
  },

  createThread({ subject, type, relatedTo, firstMessage, from, who, clientId, clientName, attachments, form }) {
    const store = this.getStore();
    const at = new Date().toISOString();
    const msg = this._makeMsg({
      from,
      who,
      text: firstMessage,
      kind: form ? 'form' : (type === 'request' ? 'request' : 'chat'),
      attachments,
      form
    });
    const thread = {
      id: 'TH' + Date.now(),
      clientId: clientId || this.CLIENT_ID,
      clientName: clientName || 'تناهي للاستثمار',
      subject: subject || 'مراسلة جديدة',
      type: type || (form ? 'request' : 'message'),
      status: from === 'admin' ? 'awaiting_client' : 'awaiting_admin',
      relatedTo: relatedTo || { kind: 'general', ref: '', label: 'عام' },
      createdAt: at,
      updatedAt: at,
      unreadAdmin: from === 'client' ? 1 : 0,
      unreadClient: from === 'admin' ? 1 : 0,
      messages: [msg]
    };
    store.threads.unshift(thread);
    this.saveStore(store);
    return thread;
  },

  reply(threadId, { from, who, text, kind, attachments, form }) {
    const store = this.getStore();
    const idx = store.threads.findIndex(t => t.id === threadId);
    if (idx < 0) return null;
    const t = store.threads[idx];
    const msg = this._makeMsg({ from, who, text, kind, attachments, form });
    t.messages.push(msg);
    t.updatedAt = msg.at;
    if (from === 'client') {
      t.unreadAdmin = (t.unreadAdmin || 0) + 1;
      t.unreadClient = 0;
      t.status = 'awaiting_admin';
    } else {
      t.unreadClient = (t.unreadClient || 0) + 1;
      t.unreadAdmin = 0;
      t.status = 'awaiting_client';
      if (kind === 'request' || form) t.type = 'request';
    }
    store.threads[idx] = t;
    this.saveStore(store);
    return t;
  },

  submitForm(threadId, messageId, response) {
    const store = this.getStore();
    const t = store.threads.find(x => x.id === threadId);
    if (!t) return null;
    const m = t.messages.find(x => x.id === messageId);
    if (!m?.form) return null;
    m.form.response = response;
    m.form.respondedAt = new Date().toISOString();
    t.updatedAt = m.form.respondedAt;
    t.status = 'awaiting_admin';
    t.unreadAdmin = (t.unreadAdmin || 0) + 1;
    // رسالة تأكيد
    t.messages.push(this._makeMsg({
      from: 'client',
      who: `عميل — ${t.clientName}`,
      text: `تم تعبئة النموذج: ${m.form.title}`,
      kind: 'form_response',
      attachments: []
    }));
    this.saveStore(store);
    try {
      if (t.relatedTo?.kind === 'visitor_entry') {
        this.applyVisitorEntryDecision(t.relatedTo.ref, response);
      }
    } catch (e) {
      console.warn('visitor entry decision failed', e);
    }
    return t;
  },

  /** تطبيق موافقة/رفض العميل على طلب دخول زائر (psr_visitors_v1) */
  applyVisitorEntryDecision(requestId, response) {
    if (!requestId) return;
    const KEY = 'psr_visitors_v1';
    let data;
    try { data = JSON.parse(localStorage.getItem(KEY)); } catch (_) { return; }
    if (!data) return;
    data.entryRequests = data.entryRequests || [];
    data.visitors = data.visitors || [];
    data.permits = data.permits || [];
    data.logs = data.logs || [];
    const req = data.entryRequests.find(r => r.id === requestId);
    if (!req || req.status === 'approved' || req.status === 'rejected') return;

    const decision = String(response?.decision || response?.القرار || '').trim();
    const approved = /موافق|approve|قبول|نعم/i.test(decision) && !/رفض|reject/i.test(decision);
    const now = new Date().toISOString();
    req.status = approved ? 'approved' : 'rejected';
    req.decidedAt = now;
    req.decidedBy = 'client';
    req.clientNotes = response?.notes || response?.ملاحظات || '';

    if (approved) {
      let visitor = data.visitors.find(v => (req.visitorId && v.id === req.visitorId) || (req.idNumber && v.idNumber === req.idNumber));
      if (!visitor) {
        visitor = {
          id: 'V' + Date.now().toString(36).toUpperCase(),
          name: req.name,
          idType: req.idType || 'national',
          idNumber: req.idNumber,
          phone: req.phone,
          host: req.host,
          reason: req.reason,
          visitAt: req.visitAt || now,
          status: 'scheduled',
          rfid: 'RFID-' + Math.floor(1000 + Math.random() * 9000),
          cardNo: 'CARD-' + Math.floor(1000 + Math.random() * 9000),
          cardKind: 'temp',
          verified: true,
          createdAt: now
        };
        data.visitors.unshift(visitor);
        req.visitorId = visitor.id;
      } else {
        visitor.verified = true;
        visitor.host = req.host || visitor.host;
        visitor.reason = req.reason || visitor.reason;
        visitor.status = 'scheduled';
      }
      const later = new Date(Date.now() + 4 * 3600000).toISOString();
      const pr = {
        id: 'PR' + Date.now().toString(36).toUpperCase(),
        kind: 'visitor',
        subjectId: visitor.id,
        gateId: req.gateId || 'G3',
        purpose: req.reason || 'زيارة',
        visitFrom: req.visitAt || now,
        visitTo: later,
        methods: ['qr', 'card'],
        qrCode: 'QR-' + Date.now().toString(36).toUpperCase(),
        rfid: visitor.rfid,
        cardNo: visitor.cardNo,
        status: 'active',
        approval: 'approved',
        idVerified: true,
        inside: false,
        checkInAt: null,
        checkOutAt: null,
        issuedAt: now,
        issuedBy: 'العميل',
        entryRequestId: req.id
      };
      data.permits.unshift(pr);
      req.permitId = pr.id;
    }

    data.logs.unshift({
      id: 'L' + Date.now(),
      at: now,
      action: approved ? 'approve' : 'revoke',
      subjectType: 'visitor',
      subjectId: req.visitorId || '',
      permitId: req.permitId || '',
      user: 'العميل',
      note: (approved ? 'موافقة عميل على دخول: ' : 'رفض عميل لدخول: ') + (req.name || '')
    });
    localStorage.setItem(KEY, JSON.stringify(data));
    try {
      window.dispatchEvent(new CustomEvent('psr-visitors', { detail: { requestId, approved } }));
    } catch (_) { /* ignore */ }
  },

  markRead(threadId, side) {
    const store = this.getStore();
    const idx = store.threads.findIndex(t => t.id === threadId);
    if (idx < 0) return;
    const t = store.threads[idx];
    const now = new Date().toISOString();
    let changed = false;
    (t.messages || []).forEach(m => {
      if (side === 'admin' && m.from === 'client' && !m.readByAdmin) {
        m.readByAdmin = true;
        m.readAdminAt = now;
        changed = true;
      }
      if (side === 'client' && m.from === 'admin' && !m.readByClient) {
        m.readByClient = true;
        m.readClientAt = now;
        changed = true;
      }
    });
    if (side === 'admin' && t.unreadAdmin) {
      t.unreadAdmin = 0;
      changed = true;
    }
    if (side === 'client' && t.unreadClient) {
      t.unreadClient = 0;
      changed = true;
    }
    if (!changed) return;
    store.threads[idx] = t;
    this.saveStore(store);
  },

  closeThread(threadId) {
    const store = this.getStore();
    const idx = store.threads.findIndex(t => t.id === threadId);
    if (idx < 0) return;
    store.threads[idx].status = 'closed';
    store.threads[idx].updatedAt = new Date().toISOString();
    this.saveStore(store);
  },

  statusLabel(st) {
    const map = {
      open: 'مفتوح',
      awaiting_admin: 'بانتظار الإدارة',
      awaiting_client: 'بانتظار العميل',
      closed: 'مغلق'
    };
    return map[st] || st;
  },

  typeLabel(tp) {
    return tp === 'request' ? 'طلب من العميل' : 'مراسلة';
  },

  /* ---- ملفات ---- */
  async fileToAttachment(file) {
    if (!file) return null;
    if (file.size > this.MAX_FILE_BYTES) {
      throw new Error('حجم الملف كبير جداً (الحد تقريباً 900KB للتخزين المحلي)');
    }
    const isImage = /^image\//.test(file.type);
    let dataUrl;
    if (isImage) dataUrl = await this._resizeImage(file);
    else dataUrl = await this._readAsDataURL(file);
    return {
      id: 'ATT' + Date.now(),
      name: file.name,
      mime: file.type || 'application/octet-stream',
      size: file.size,
      kind: isImage ? 'image' : (file.type.startsWith('audio/') ? 'audio' : 'file'),
      dataUrl
    };
  },

  _readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  },

  _resizeImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        const max = this.MAX_IMAGE_EDGE;
        if (width > max || height > max) {
          const ratio = Math.min(max / width, max / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.onerror = reject;
      img.src = url;
    });
  },

  formatSize(n) {
    if (n < 1024) return n + ' B';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' KB';
    return (n / 1048576).toFixed(1) + ' MB';
  },

  /* ---- عرض رسالة موحّد ---- */
  renderAttachments(atts) {
    if (!atts?.length) return '';
    return `<div class="psr-atts">${atts.map(a => {
      if (a.kind === 'image') {
        return `<a class="psr-att-img" href="${a.dataUrl}" target="_blank" download="${a.name}">
          <img src="${a.dataUrl}" alt="${a.name}" loading="lazy">
          <span>${a.name}</span>
        </a>`;
      }
      if (a.kind === 'audio') {
        return `<div class="psr-att-audio">
          <audio controls src="${a.dataUrl}"></audio>
          <span>${a.name || 'تسجيل صوتي'} · ${this.formatSize(a.size || 0)}</span>
        </div>`;
      }
      return `<a class="psr-att-file" href="${a.dataUrl}" download="${a.name}" target="_blank">
        <i class="bi bi-paperclip"></i> ${a.name}
        <small>${this.formatSize(a.size || 0)}</small>
      </a>`;
    }).join('')}</div>`;
  },

  _fieldInputHtml(field, { disabled = false, namePrefix = '' } = {}) {
    const name = namePrefix + field.name;
    const req = field.required && !disabled ? 'required' : '';
    const dis = disabled ? 'disabled' : '';
    const label = `${this.escapeHtml(field.label)}${field.required ? ' *' : ''}`;
    if (field.type === 'textarea') {
      return `<label class="psr-form-field"><span>${label}</span>
        <textarea name="${name}" ${req} ${dis} rows="2"></textarea></label>`;
    }
    if (field.type === 'select') {
      const opts = (field.options || []).map(o =>
        `<option value="${this.escapeHtml(o)}">${this.escapeHtml(o)}</option>`
      ).join('');
      return `<label class="psr-form-field"><span>${label}</span>
        <select name="${name}" ${req} ${dis}><option value="">— اختر —</option>${opts}</select></label>`;
    }
    return `<label class="psr-form-field"><span>${label}</span>
      <input type="${field.type || 'text'}" name="${name}" ${req} ${dis}></label>`;
  },

  renderFormPreview(form) {
    if (!form) return '';
    if (form.choice && Array.isArray(form.options)) {
      const cards = form.options.map(o => `
        <div class="psr-form-choice-card preview">
          <strong>${this.escapeHtml(o.title)}</strong>
          <div class="psr-form-meta">${(o.fields || []).length} حقول</div>
          ${(o.fields || []).slice(0, 4).map(f =>
            `<div class="psr-form-meta">• ${this.escapeHtml(f.label)}</div>`
          ).join('')}
        </div>`).join('');
      return `<div class="psr-form preview">
        <div class="psr-form-title">${this.escapeHtml(form.title || 'خيارات النماذج')}</div>
        <div class="psr-form-choices">${cards}</div>
      </div>`;
    }
    const fields = (form.fields || []).map(f => this._fieldInputHtml(f, { disabled: true })).join('');
    return `<div class="psr-form preview">
      <div class="psr-form-title">${this.escapeHtml(form.title || 'معاينة النموذج')}</div>
      ${fields}
      <div class="psr-form-meta">معاينة فقط — لن تُرسل بعد</div>
    </div>`;
  },

  renderForm(m, side) {
    const f = m.form;
    if (!f) return '';
    if (f.response) {
      const rows = Object.entries(f.response).map(([k, v]) => {
        const field = (f.fields || []).find(x => x.name === k);
        return `<div class="psr-form-row"><strong>${this.escapeHtml(field?.label || k)}:</strong> ${this.escapeHtml(v || '—')}</div>`;
      }).join('');
      return `<div class="psr-form done">
        <div class="psr-form-title">✓ ${this.escapeHtml(f.title)} — تم التعبئة</div>
        ${rows}
        <div class="psr-form-meta">بتاريخ ${this._dateLabel(f.respondedAt)}</div>
      </div>`;
    }

    // حزمة خيارات: العميل يختار نموذجاً ثم يعبّئه
    if (f.choice && Array.isArray(f.options) && !f.selectedOptionId) {
      if (side === 'client' && m.from === 'admin') {
        const cards = f.options.map(o => `
          <button type="button" class="psr-form-choice-card" data-pick-form="${o.id}" data-form-msg="${m.id}">
            <strong>${this.escapeHtml(o.title)}</strong>
            <div class="psr-form-meta">${(o.fields || []).length} حقول</div>
          </button>`).join('');
        return `<div class="psr-form pending choice">
          <div class="psr-form-title">${this.escapeHtml(f.title || 'اختر نموذجاً')}</div>
          <div class="psr-form-meta mb-2">اختر أحد النماذج أدناه للتعبئة</div>
          <div class="psr-form-choices">${cards}</div>
        </div>`;
      }
      return `<div class="psr-form pending choice">
        <div class="psr-form-title">${this.escapeHtml(f.title || 'خيارات نماذج')}</div>
        <div class="psr-form-meta">بانتظار اختيار العميل · ${f.options.length} نماذج</div>
        <ul class="psr-form-options-list">${f.options.map(o =>
          `<li>${this.escapeHtml(o.title)} <small>(${(o.fields || []).length} حقول)</small></li>`
        ).join('')}</ul>
      </div>`;
    }

    const title = f.selectedOptionId
      ? (f.options?.find(o => o.id === f.selectedOptionId)?.title || f.title)
      : f.title;

    if (side === 'client' && m.from === 'admin') {
      const fields = (f.fields || []).map(field => this._fieldInputHtml(field)).join('');
      return `<form class="psr-form pending" data-form-msg="${m.id}">
        <div class="psr-form-title">${this.escapeHtml(title)}</div>
        ${fields}
        <button type="submit" class="psr-btn-gold">إرسال النموذج</button>
      </form>`;
    }
    return `<div class="psr-form pending">
      <div class="psr-form-title">${this.escapeHtml(title)}</div>
      <div class="psr-form-meta">بانتظار تعبئة العميل · ${(f.fields || []).length} حقول</div>
    </div>`;
  },

  selectFormOption(threadId, messageId, optionId) {
    const store = this.getStore();
    const t = store.threads.find(x => x.id === threadId);
    if (!t) return null;
    const m = t.messages.find(x => x.id === messageId);
    if (!m?.form?.choice || !m.form.options) return null;
    const opt = m.form.options.find(o => o.id === optionId);
    if (!opt) return null;
    m.form.selectedOptionId = opt.id;
    m.form.title = opt.title;
    m.form.fields = JSON.parse(JSON.stringify(opt.fields || []));
    t.updatedAt = new Date().toISOString();
    this.saveStore(store);
    return t;
  },

  readReceiptHtml(m, side) {
    // الجانب يرى حالة قراءته لرسائله الصادرة
    if (side === 'admin' && m.from === 'admin') {
      if (m.readByClient) {
        return `<span class="psr-read read" title="${this._dateLabel(m.readClientAt)}">✓✓ تمت القراءة</span>`;
      }
      return `<span class="psr-read unread">✓ لم تُقرأ بعد</span>`;
    }
    if (side === 'client' && m.from === 'client') {
      if (m.readByAdmin) {
        return `<span class="psr-read read" title="${this._dateLabel(m.readAdminAt)}">✓✓ تمت القراءة</span>`;
      }
      return `<span class="psr-read unread">✓ لم تُقرأ بعد</span>`;
    }
    // للوارد: هل أنا قرأتها
    if (side === 'admin' && m.from === 'client') {
      return m.readByAdmin
        ? `<span class="psr-read read">مقروءة</span>`
        : `<span class="psr-read unread-in">غير مقروءة</span>`;
    }
    if (side === 'client' && m.from === 'admin') {
      return m.readByClient
        ? `<span class="psr-read read">مقروءة</span>`
        : `<span class="psr-read unread-in">غير مقروءة</span>`;
    }
    return '';
  },

  renderMessage(m, side) {
    const kindBadge = m.kind === 'request' || m.kind === 'form'
      ? '<span class="psr-chip request">طلب</span>'
      : m.kind === 'form_response'
        ? '<span class="psr-chip response">رد نموذج</span>'
        : '';
    return `
      <div class="psr-bubble ${m.from === 'admin' ? 'admin' : 'client'}" data-msg="${m.id}">
        <div class="psr-who">
          <span>${m.who} · ${this._timeLabel(m.at)}</span>
          ${kindBadge}
          ${this.readReceiptHtml(m, side)}
        </div>
        ${m.text ? `<div class="psr-text">${this.escapeHtml(m.text)}</div>` : ''}
        ${this.renderAttachments(m.attachments)}
        ${this.renderForm(m, side)}
      </div>`;
  },

  escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  composeBarHtml(prefix) {
    return `
      <div class="psr-compose" data-compose="${prefix}">
        <div class="psr-compose-tools">
          <label class="psr-tool" title="إرفاق ملف">
            <i class="bi bi-paperclip"></i>
            <input type="file" accept="*/*" data-file hidden>
          </label>
          <label class="psr-tool" title="صورة">
            <i class="bi bi-image"></i>
            <input type="file" accept="image/*" data-image hidden>
          </label>
          <button type="button" class="psr-tool" data-voice title="تسجيل صوتي"><i class="bi bi-mic"></i></button>
          <button type="button" class="psr-tool" data-form-btn title="إرسال نموذج" ${prefix === 'client' ? 'hidden' : ''}><i class="bi bi-ui-checks"></i></button>
          <span class="psr-voice-status" data-voice-status hidden></span>
        </div>
        <div class="psr-pending-atts" data-pending></div>
        <div class="psr-compose-row">
          <textarea data-text rows="2" placeholder="اكتب رسالتك..."></textarea>
          <button type="button" class="psr-btn-gold" data-send><i class="bi bi-send-fill"></i></button>
        </div>
      </div>`;
  },

  builtinFormCatalog() {
    return [
      {
        id: 'tpl-followup',
        title: 'نموذج متابعة',
        description: 'موضوع وتفاصيل وتاريخ تواصل',
        fields: [
          { name: 'title', label: 'الموضوع', type: 'text', required: true },
          { name: 'details', label: 'التفاصيل', type: 'textarea', required: true },
          { name: 'date', label: 'التاريخ', type: 'date', required: false },
          { name: 'contact', label: 'رقم التواصل', type: 'text', required: false }
        ]
      },
      {
        id: 'tpl-shifts',
        title: 'اعتماد المناوبات',
        description: 'موقع وعدد ورديات وتاريخ اعتماد',
        fields: [
          { name: 'site', label: 'الموقع', type: 'text', required: true },
          { name: 'shifts', label: 'عدد الورديات', type: 'number', required: true },
          { name: 'date', label: 'تاريخ الاعتماد', type: 'date', required: true },
          { name: 'period', label: 'الفترة', type: 'select', required: true, options: ['صباحي', 'مسائي', 'ليلي', 'مختلط'] },
          { name: 'notes', label: 'ملاحظات', type: 'textarea', required: false }
        ]
      },
      {
        id: 'tpl-reinforcement',
        title: 'طلب تعزيز أفراد',
        description: 'عدد الحراس والفترة والموقع',
        fields: [
          { name: 'site', label: 'الموقع / المشروع', type: 'text', required: true },
          { name: 'count', label: 'عدد الأفراد المطلوبين', type: 'number', required: true },
          { name: 'from', label: 'من تاريخ', type: 'date', required: true },
          { name: 'to', label: 'إلى تاريخ', type: 'date', required: true },
          { name: 'shift', label: 'الوردية', type: 'select', required: true, options: ['صباحي', 'مسائي', 'ليلي', 'كامل اليوم'] },
          { name: 'reason', label: 'سبب الطلب', type: 'textarea', required: true }
        ]
      },
      {
        id: 'tpl-incident',
        title: 'إبلاغ عن حادثة',
        description: 'تقرير حادثة أمنية أو تشغيلية',
        fields: [
          { name: 'site', label: 'موقع الحادثة', type: 'text', required: true },
          { name: 'when', label: 'وقت الحادثة', type: 'date', required: true },
          { name: 'severity', label: 'مستوى الخطورة', type: 'select', required: true, options: ['منخفض', 'متوسط', 'عالي', 'حرج'] },
          { name: 'desc', label: 'وصف الحادثة', type: 'textarea', required: true },
          { name: 'actions', label: 'إجراءات متخذة', type: 'textarea', required: false }
        ]
      },
      {
        id: 'tpl-satisfaction',
        title: 'تقييم رضا العميل',
        description: 'تقييم مستوى الخدمة',
        fields: [
          { name: 'score', label: 'التقييم العام', type: 'select', required: true, options: ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ضعيف'] },
          { name: 'punctuality', label: 'الالتزام بالمواعيد', type: 'select', required: true, options: ['ممتاز', 'جيد', 'يحتاج تحسين'] },
          { name: 'notes', label: 'ملاحظات / اقتراحات', type: 'textarea', required: false },
          { name: 'contact', label: 'اسم المسؤول للتواصل', type: 'text', required: false }
        ]
      },
      {
        id: 'tpl-quote',
        title: 'طلب عرض سعر',
        description: 'بيانات لطلب تسعيرة خدمة',
        fields: [
          { name: 'service', label: 'نوع الخدمة', type: 'select', required: true, options: ['حراسة مواقع', 'حراسة مناسبات', 'دوريات', 'أخرى'] },
          { name: 'sites', label: 'عدد المواقع', type: 'number', required: true },
          { name: 'guards', label: 'عدد الحراس التقريبي', type: 'number', required: true },
          { name: 'duration', label: 'مدة العقد المطلوبة', type: 'text', required: true },
          { name: 'notes', label: 'تفاصيل إضافية', type: 'textarea', required: false }
        ]
      }
    ];
  },

  getCustomFormTemplates() {
    try {
      const raw = JSON.parse(localStorage.getItem(this.FORM_TPL_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (_) {
      return [];
    }
  },

  saveCustomFormTemplate(tpl) {
    const list = this.getCustomFormTemplates();
    const item = {
      id: tpl.id || ('custom-' + Date.now()),
      title: tpl.title || 'نموذج مخصص',
      description: tpl.description || 'محفوظ محلياً',
      custom: true,
      fields: tpl.fields || []
    };
    const idx = list.findIndex(x => x.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    localStorage.setItem(this.FORM_TPL_KEY, JSON.stringify(list));
    return item;
  },

  deleteCustomFormTemplate(id) {
    const list = this.getCustomFormTemplates().filter(x => x.id !== id);
    localStorage.setItem(this.FORM_TPL_KEY, JSON.stringify(list));
  },

  getFormCatalog() {
    return [...this.builtinFormCatalog(), ...this.getCustomFormTemplates()];
  },

  getFormTemplateById(id) {
    return this.getFormCatalog().find(t => t.id === id) || null;
  },

  cloneFormFromTemplate(tpl, titleOverride) {
    const src = typeof tpl === 'string' ? this.getFormTemplateById(tpl) : tpl;
    if (!src) return this.defaultFormTemplate();
    return {
      id: 'F' + Date.now() + Math.random().toString(16).slice(2, 5),
      title: titleOverride || src.title,
      fields: JSON.parse(JSON.stringify(src.fields || [])),
      response: null,
      respondedAt: null
    };
  },

  buildChoiceForm(templates, packTitle) {
    const options = templates.map(t => {
      const cloned = this.cloneFormFromTemplate(t);
      return { id: cloned.id, title: cloned.title, fields: cloned.fields };
    });
    return {
      id: 'FPACK' + Date.now(),
      choice: true,
      title: packTitle || 'اختر أحد النماذج للتعبئة',
      options,
      selectedOptionId: null,
      fields: [],
      response: null,
      respondedAt: null
    };
  },

  defaultFormTemplate() {
    return this.cloneFormFromTemplate('tpl-followup');
  }
};

if (typeof window !== 'undefined') window.ClientBridge = ClientBridge;
