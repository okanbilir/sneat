(function () {
  'use strict';

  const dummy = [
    { id:'a1', title:'Asansör Bakımı', date:'Bugün', body:'Saat 14:00-16:00 arası bakım yapılacaktır.' },
    { id:'a2', title:'Aidat Hatırlatma', date:'Dün', body:'Ay sonuna kadar ödemelerinizi yapabilirsiniz.' }
  ];

  window.initAnnouncements = function () {
    const host = document.getElementById('annList');
    if (!host) return;

    host.innerHTML = dummy.map(x => `
      <div class="col-12 col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-start justify-content-between">
              <div>
                <h5 class="mb-1">${x.title}</h5>
                <small class="text-muted">${x.date}</small>
              </div>
              <span class="badge bg-label-primary">Duyuru</span>
            </div>
            <p class="mt-3 mb-0">${x.body}</p>
          </div>
        </div>
      </div>
    `).join('');
  };
})();
