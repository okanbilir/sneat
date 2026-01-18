(function () {
  'use strict';

  let rows = [
    { id:'a1', title:'Asansör Bakımı', date:'2026-01-18', body:'Saat 14:00-16:00 arası bakım.' },
    { id:'a2', title:'Aidat Hatırlatma', date:'2026-01-17', body:'Ay sonuna kadar ödeme.' }
  ];

  function render() {
    window.CrudUI.renderTable({
      tbodyId: 'annTbody',
      rows,
      columns: [
        { key:'title' },
        { key:'date' }
      ],
      onEdit: (id) => openEdit(id),
      onDelete: (id) => {
        rows = rows.filter(r => r.id !== id);
        render();
      }
    });
  }

  function openEdit(id) {
    const r = rows.find(x => x.id === id);
    if (!r) return;

    document.getElementById('annId').value = r.id;
    document.getElementById('annTitle').value = r.title;
    document.getElementById('annBody').value = r.body;
    window.CrudUI.openModal('annModal');
  }

  function openNew() {
    document.getElementById('annId').value = '';
    document.getElementById('annTitle').value = '';
    document.getElementById('annBody').value = '';
    window.CrudUI.openModal('annModal');
  }

  window.initAnnouncementsManage = function () {
    document.getElementById('btnNewAnn')?.addEventListener('click', openNew);

    document.getElementById('annForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('annId').value || window.CrudUI.newId();
      const title = document.getElementById('annTitle').value.trim();
      const body = document.getElementById('annBody').value.trim();

      const existing = rows.find(x => x.id === id);
      if (existing) {
        existing.title = title;
        existing.body = body;
      } else {
        rows.unshift({ id, title, body, date: new Date().toISOString().slice(0,10) });
      }

      window.CrudUI.closeModal('annModal');
      render();
    });

    render();
  };
})();
