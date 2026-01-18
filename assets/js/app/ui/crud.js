// assets/js/app/ui/crud.js
(function () {
  'use strict';

  function uid() { return Math.random().toString(16).slice(2) + Date.now().toString(16); }

  window.CrudUI = {
    // tableId: tbody id, modalId: modal id
    renderTable({ tbodyId, rows, columns, onEdit, onDelete }) {
      const tbody = document.getElementById(tbodyId);
      if (!tbody) return;
      tbody.innerHTML = rows.map(r => `
        <tr>
          ${columns.map(c => `<td>${(r[c.key] ?? '')}</td>`).join('')}
          <td class="text-end">
            <button class="btn btn-sm btn-icon btn-outline-primary me-1" data-act="edit" data-id="${r.id}">
              <i class="bx bx-edit-alt"></i>
            </button>
            <button class="btn btn-sm btn-icon btn-outline-danger" data-act="del" data-id="${r.id}">
              <i class="bx bx-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('[data-act="edit"]').forEach(b => b.addEventListener('click', () => onEdit?.(b.dataset.id)));
      tbody.querySelectorAll('[data-act="del"]').forEach(b => b.addEventListener('click', () => onDelete?.(b.dataset.id)));
    },

    openModal(modalId) {
      const el = document.getElementById(modalId);
      if (!el) return;
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.show();
    },

    closeModal(modalId) {
      const el = document.getElementById(modalId);
      if (!el) return;
      const modal = bootstrap.Modal.getOrCreateInstance(el);
      modal.hide();
    },

    newId: uid
  };
})();
