import { useEffect, useState } from "react";

const exampleProjects = [
  {
    id: 1,
    name: "Müşteri Segmentasyonu",
    description: "Müşterileri davranışlarına göre gruplandırma.",
    technology: "Python, Pandas",
    status: "Devam Ediyor",
  },
  {
    id: 2,
    name: "Ev Fiyatı Tahmini",
    description: "Makine öğrenmesi ile ev fiyatlarını tahmin etme.",
    technology: "Python, Scikit-learn",
    status: "Planlandı",
  },
  {
    id: 3,
    name: "Duygu Analizi",
    description: "Metinlerdeki olumlu ve olumsuz duyguları analiz etme.",
    technology: "Python, NLP",
    status: "Tamamlandı",
  },
];

const emptyForm = {
  name: "",
  description: "",
  technology: "",
  status: "Planlandı",
};

function loadProjects() {
  try {
    const savedProjects = localStorage.getItem("datalab-projects");
    return savedProjects ? JSON.parse(savedProjects) : exampleProjects;
  } catch {
    return exampleProjects;
  }
}

function App() {
  const [projects, setProjects] = useState(loadProjects);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tümü");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("datalab-projects", JSON.stringify(projects));
  }, [projects]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("Lütfen proje adı gir.");
      return;
    }

    if (editingId !== null) {
      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          project.id === editingId
            ? { ...form, id: editingId }
            : project
        )
      );
    } else {
      const newProject = {
        ...form,
        id: Date.now(),
      };

      setProjects((previousProjects) => [
        newProject,
        ...previousProjects,
      ]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  }

  function handleEdit(project) {
    setForm({
      name: project.name,
      description: project.description,
      technology: project.technology,
      status: project.status,
    });

    setEditingId(project.id);
    setFormOpen(true);
  }

  function handleDelete(id) {
    const approved = window.confirm(
      "Bu projeyi silmek istediğine emin misin?"
    );

    if (!approved) return;

    setProjects((previousProjects) =>
      previousProjects.filter((project) => project.id !== id)
    );
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setFormOpen(false);
  }

  const visibleProjects = projects.filter((project) => {
    const searchText = search.toLocaleLowerCase("tr-TR");

    const matchesSearch = [
      project.name,
      project.description,
      project.technology,
    ].some((value) =>
      value.toLocaleLowerCase("tr-TR").includes(searchText)
    );

    const matchesStatus =
      filterStatus === "Tümü" || project.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const completedCount = projects.filter(
    (project) => project.status === "Tamamlandı"
  ).length;

  const ongoingCount = projects.filter(
    (project) => project.status === "Devam Ediyor"
  ).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">D</span>
          <span>DataLab</span>
        </a>

        <p className="nav-heading">ÇALIŞMA ALANI</p>

        <a className="nav-link active" href="#dashboard">
          <span>▦</span> Genel Bakış
        </a>

        <a className="nav-link" href="#projects">
          <span>▤</span> Projelerim
        </a>

        <div className="sidebar-bottom">
          <div className="profile-avatar">DS</div>
          <div>
            <strong>DataLab Kullanıcısı</strong>
            <p>Öğrenci hesabı</p>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">VERİ BİLİMİ ÇALIŞMA ALANI</p>
            <h1>Proje paneli</h1>
          </div>

          <button className="primary-button" onClick={openAddForm}>
            <span>＋</span> Yeni proje
          </button>
        </header>

        <section className="welcome-section">
          <div>
            <p className="welcome-label">ÇALIŞMA ALANIN</p>
            <h2>Fikirlerini projeye dönüştür.</h2>
            <p>
              Veri bilimi projelerini tek yerde düzenle, takip et ve
              ilerlemeni keşfet.
            </p>
          </div>
          <div className="welcome-decoration" aria-hidden="true">
            <span>01</span>
            <span>10</span>
            <span>11</span>
            <span>01</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Proje istatistikleri">
          <article className="stat-card">
            <div className="stat-icon purple">▤</div>
            <p>Toplam proje</p>
            <strong>{projects.length}</strong>
            <span>Kayıtlı tüm projeler</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon blue">◷</div>
            <p>Devam eden</p>
            <strong>{ongoingCount}</strong>
            <span>Üzerinde çalışılan projeler</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Tamamlanan</p>
            <strong>{completedCount}</strong>
            <span>Bitirilen projeler</span>
          </article>
        </section>

        {formOpen && (
          <section className="form-panel" id="project-form">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  {editingId !== null ? "PROJE DÜZENLEME" : "YENİ KAYIT"}
                </p>
                <h2>
                  {editingId !== null ? "Projeyi güncelle" : "Yeni proje oluştur"}
                </h2>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={handleCancel}
                aria-label="Formu kapat"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Proje adı *
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Örn. Satış tahmini modeli"
                    required
                  />
                </label>

                <label>
                  Kullanılan teknoloji
                  <input
                    name="technology"
                    value={form.technology}
                    onChange={handleChange}
                    placeholder="Örn. Python, Pandas"
                  />
                </label>

                <label className="full-width">
                  Proje açıklaması
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Projenin amacını kısaca açıkla..."
                    rows="3"
                  />
                </label>

                <label>
                  Proje durumu
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option>Planlandı</option>
                    <option>Devam Ediyor</option>
                    <option>Tamamlandı</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                >
                  Vazgeç
                </button>
                <button className="primary-button" type="submit">
                  {editingId !== null ? "Değişiklikleri kaydet" : "Projeyi ekle"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROJE YÖNETİMİ</p>
              <h2>Projelerim</h2>
              <p className="section-description">
                Projelerini görüntüle ve ilerlemelerini takip et.
              </p>
            </div>
            <span className="project-count">{visibleProjects.length} kayıt</span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Proje ara..."
                aria-label="Proje ara"
              />
            </div>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              aria-label="Duruma göre filtrele"
            >
              <option value="Tümü">Tüm durumlar</option>
              <option value="Planlandı">Planlandı</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
            </select>
          </div>

          {visibleProjects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⌕</div>
              <h3>Proje bulunamadı</h3>
              <p>
                Aramanı değiştirebilir veya yeni bir proje ekleyebilirsin.
              </p>
              <button className="primary-button" onClick={openAddForm}>
                ＋ Yeni proje ekle
              </button>
            </div>
          ) : (
            <div className="project-grid">
              {visibleProjects.map((project) => (
                <article className="project-card" key={project.id}>
                  <div className="project-card-top">
                    <div className="project-symbol">⌘</div>
                    <span
                      className={`status-badge ${
                        project.status === "Tamamlandı"
                          ? "status-completed"
                          : project.status === "Devam Ediyor"
                          ? "status-ongoing"
                          : "status-planned"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3>{project.name}</h3>
                  <p className="project-description">
                    {project.description || "Bu proje için henüz açıklama yok."}
                  </p>

                  <div className="technology-tag">
                    {project.technology || "Teknoloji belirtilmedi"}
                  </div>

                  <div className="card-actions">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(project)}
                    >
                      ✎ Düzenle
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Sil
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          <span>DataLab</span>
          <span>Veri bilimi projelerin için çalışma alanın.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;