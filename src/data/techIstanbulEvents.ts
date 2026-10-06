import { CalendarEvent } from '../types';

export const TECH_ISTANBUL_BOOTCAMP_EVENTS: CalendarEvent[] = [
  // 1. Oturum - 8 Eylül 2026 Salı
  {
    id: 'tech-istanbul-ai-ders-1',
    title: '🚀 Tech Istanbul AI Bootcamp: Açılış & Python ile Modern YZ Temelleri',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i Başlangıç Oturumu! 🎉

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 8 Eylül 2026 Salı

📌 Oturum Kapsamı:
• Tanışma, Bootcamp yol haritası ve program hedefleri
• Python ile yapay zekâ geliştirme ortamının kurulması (VS Code, Virtual Environment, Jupyter)
• NumPy & Pandas ile vektörel hesaplamalar ve büyük veri manipülasyonu
• Gerçek veri setleri üzerinde temel veri hazırlığı pratikleri

🔗 Eğitim bağlantısı ve katılım linki Tech Istanbul tarafından e-posta / mesajla iletilecektir.`,
    startDate: '2026-09-08T16:00:00',
    endDate: '2026-09-08T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7', // Tech Istanbul Cyan / Ocean Blue
    reminderMinutes: 120, // 2 saat önce hatırlatıcı
    priority: 'critical',
    tags: ['Tech Istanbul', 'Bootcamp', 'Yapay Zeka', 'Python', 'NumPy', 'Pandas'],
    deliverables: [
      { id: 'ti-del-1', text: 'Tech Istanbul canlı yayın linkini kontrol ettim ve katıldım', completed: false },
      { id: 'ti-del-2', text: 'Python geliştirme ortamını ve kütüphanelerini kurdum', completed: false },
      { id: 'ti-del-3', text: '1. Hafta Python veri yapıları alıştırmalarını tamamladım', completed: false }
    ]
  },

  // 2. Oturum - 10 Eylül 2026 Perşembe
  {
    id: 'tech-istanbul-ai-ders-2',
    title: '📊 Tech Istanbul AI Bootcamp: Keşifçi Veri Analitiği (EDA) & Özellik Mühendisliği',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 2. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 10 Eylül 2026 Perşembe

📌 Oturum Kapsamı:
• Matplotlib & Seaborn ile veri görselleştirme teknikleri
• Eksik veri tamamlama (imputation), aykırı değer (outlier) tespiti ve normalizasyon
• Özellik Mühendisliği (Feature Engineering) ve kategorik kodlama (One-Hot, Label Encoding)
• Makine öğrenmesi modelleri için veri seti hazırlama pipeline'ı`,
    startDate: '2026-09-10T16:00:00',
    endDate: '2026-09-10T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Bootcamp', 'EDA', 'Feature Engineering', 'Veri Analitiği'],
    deliverables: [
      { id: 'ti-del-4', text: 'EDA veri analiz notebook çalışmasını tamamladım', completed: false },
      { id: 'ti-del-5', text: 'Özellik mühendisliği fonksiyonlarını test ettim', completed: false }
    ]
  },

  // 3. Oturum - 15 Eylül 2026 Salı
  {
    id: 'tech-istanbul-ai-ders-3',
    title: '🤖 Tech Istanbul AI Bootcamp: Klasik Makine Öğrenmesi (ML) & Scikit-Learn',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 3. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 15 Eylül 2026 Salı

📌 Oturum Kapsamı:
• Denetimli Öğrenme: Regresyon (Linear, Ridge) ve Sınıflandırma (Logistic, Random Forest, XGBoost)
• Model değerlendirme metrikleri: Confusion Matrix, Accuracy, Precision, Recall, F1-Score, ROC-AUC
• Cross-Validation ve K-Fold çapraz doğrulama
• Scikit-Learn Pipeline mimarisi ve GridSearch optimizasyonu`,
    startDate: '2026-09-15T16:00:00',
    endDate: '2026-09-15T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Bootcamp', 'Machine Learning', 'Scikit-Learn', 'Classification'],
    deliverables: [
      { id: 'ti-del-6', text: 'Scikit-learn ile model eğitimi ve metrik raporu oluşturdum', completed: false },
      { id: 'ti-del-7', text: 'Model hiperparametre optimizasyonunu tamamladım', completed: false }
    ]
  },

  // 4. Oturum - 17 Eylül 2026 Perşembe
  {
    id: 'tech-istanbul-ai-ders-4',
    title: '🧠 Tech Istanbul AI Bootcamp: Derin Öğrenme & PyTorch ile Yapay Sinir Ağları',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 4. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 17 Eylül 2026 Perşembe

📌 Oturum Kapsamı:
• Derin Öğrenmeye Giriş: Perceptron, Çok Katmanlı Algılayıcılar (MLP)
• Aktivasyon fonksiyonları (ReLU, GELU, Sigmoid), Loss fonksiyonları ve Backpropagation
• PyTorch Temelleri: Tensors, Autograd, nn.Module ve Optimizer mekanizması
• Uçtan uca PyTorch eğitim döngüsü (Training & Validation Loop) yazımı`,
    startDate: '2026-09-17T16:00:00',
    endDate: '2026-09-17T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Bootcamp', 'Deep Learning', 'PyTorch', 'Neural Networks'],
    deliverables: [
      { id: 'ti-del-8', text: 'PyTorch ile ilk yapay sinir ağı modelini eğittim', completed: false },
      { id: 'ti-del-9', text: 'Loss eğrilerini görselleştirip doğruladım', completed: false }
    ]
  },

  // 5. Oturum - 22 Eylül 2026 Salı
  {
    id: 'tech-istanbul-ai-ders-5',
    title: '💬 Tech Istanbul AI Bootcamp: Büyük Dil Modelleri (LLM) & Prompt Engineering',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 5. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 22 Eylül 2026 Salı

📌 Oturum Kapsamı:
• Transformer mimarisi ve Dil Modellerinin çalışma mantığı
• Modern LLM API'leri (Gemini, OpenAI, Claude) ile entegrasyon
• İleri Düzey Prompt Mühendisliği: Few-shot, Chain-of-Thought (CoT), System Instructions
• Yapılandırılmış Çıktı (Structured JSON Output) ve Pydantic ile veri doğrulama`,
    startDate: '2026-09-22T16:00:00',
    endDate: '2026-09-22T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'critical',
    tags: ['Tech Istanbul', 'Bootcamp', 'LLM', 'Prompt Engineering', 'Generative AI'],
    deliverables: [
      { id: 'ti-del-10', text: 'LLM API entegrasyon kodunu çalıştırdım', completed: false },
      { id: 'ti-del-11', text: 'Yapılandırılmış JSON yanıt üreten prompt denemeleri yaptım', completed: false }
    ]
  },

  // 6. Oturum - 24 Eylül 2026 Perşembe
  {
    id: 'tech-istanbul-ai-ders-6',
    title: '📚 Tech Istanbul AI Bootcamp: RAG (Retrieval-Augmented Generation) & Vektör Veritabanları',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 6. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 24 Eylül 2026 Perşembe

📌 Oturum Kapsamı:
• RAG Nedir? Neden gereklidir ve model halüsinasyonlarını nasıl engeller?
• Vektör Temsilleri (Embeddings) ve Benzerlik Ölçütleri (Cosine Similarity)
• Vektör Veritabanları (ChromaDB, FAISS, Qdrant) ile doküman indeksleme
• Metin parçalama (Chunking Strategies) ve semantik arama motoru kurma`,
    startDate: '2026-09-24T16:00:00',
    endDate: '2026-09-24T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'critical',
    tags: ['Tech Istanbul', 'Bootcamp', 'RAG', 'Vector Database', 'ChromaDB', 'Embeddings'],
    deliverables: [
      { id: 'ti-del-12', text: 'PDF ve metin dokümanlarını parçalayarak vektör veri tabanına kaydettim', completed: false },
      { id: 'ti-del-13', text: 'Semantik arama sorguları ile en alakalı metinleri listeledim', completed: false }
    ]
  },

  // 7. Oturum - 29 Eylül 2026 Salı
  {
    id: 'tech-istanbul-ai-ders-7',
    title: '🛠️ Tech Istanbul AI Bootcamp: Gelişmiş RAG Mimarileri & LangChain / LlamaIndex',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 7. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 29 Eylül 2026 Salı

📌 Oturum Kapsamı:
• Gelişmiş RAG: Hibrit Arama (Keyword + Semantic) ve Re-ranking (Yeniden Sıralama)
• Context Compression ve Metadata Filtering teknikleri
• LangChain ve LlamaIndex kütüphaneleri ile modüler RAG pipeline inşası
• Halüsinasyon denetimi, kaynak referansı ekleme (Citation) ve yanıt doğrulaması`,
    startDate: '2026-09-29T16:00:00',
    endDate: '2026-09-29T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Bootcamp', 'Advanced RAG', 'LangChain', 'LlamaIndex'],
    deliverables: [
      { id: 'ti-del-14', text: 'LangChain / LlamaIndex ile çalışan RAG pipeline kurdum', completed: false },
      { id: 'ti-del-15', text: 'Re-ranking algoritmasını test edip arama kalitesini artırdım', completed: false }
    ]
  },

  // 8. Oturum - 1 Ekim 2026 Perşembe
  {
    id: 'tech-istanbul-ai-ders-8',
    title: '🕵️ Tech Istanbul AI Bootcamp: AI Agent Mimarileri & Otonom Ajanlar',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 8. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 1 Ekim 2026 Perşembe

📌 Oturum Kapsamı:
• AI Agent kavramı: LLM'leri eylem alabilen otonom sistemlere dönüştürme
• ReAct (Reasoning + Acting) döngüsü ve düşünce zinciri
• Araç Çağırma (Tool Calling / Function Calling): Web araması, hesap makinesi, API sorgulama
• Çoklu Ajan Sistemleri (Multi-Agent Systems) ile iş birliği yapan AI ajanları`,
    startDate: '2026-10-01T16:00:00',
    endDate: '2026-10-01T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'critical',
    tags: ['Tech Istanbul', 'Bootcamp', 'AI Agents', 'Function Calling', 'Autonomous AI'],
    deliverables: [
      { id: 'ti-del-16', text: 'Kendi aracını (Tool) çağıran bir AI Agent geliştirdim', completed: false },
      { id: 'ti-del-17', text: 'Çok adımlı görev yürüten ajan senaryosunu tamamladım', completed: false }
    ]
  },

  // 9. Oturum - 6 Ekim 2026 Salı
  {
    id: 'tech-istanbul-ai-ders-9',
    title: '⚡ Tech Istanbul AI Bootcamp: Gerçek Senaryolarla Uçtan Uca AI Uygulaması & Dağıtım',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i 9. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 6 Ekim 2026 Salı

📌 Oturum Kapsamı:
• FastAPI ile yapay zekâ model ve ajanlarını REST API olarak sunma
• Kullanıcı arayüzü entegrasyonu (Streamlit / React / Web UI)
• Gerçek dünya vaka senaryosu: Kurumsal doküman asistanı veya akıllı analiz ajanı
• Proje yayına alma (Deployment), Docker konteynerleme ve performans izleme`,
    startDate: '2026-10-06T16:00:00',
    endDate: '2026-10-06T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Bootcamp', 'FastAPI', 'Deployment', 'Full-Stack AI'],
    deliverables: [
      { id: 'ti-del-18', text: 'Bootcamp bitirme projesi API ve arayüzünü hazırladım', completed: false },
      { id: 'ti-del-19', text: 'Proje demosunu ve dokümantasyonunu tamamladım', completed: false }
    ]
  },

  // 10. Oturum - 8 Ekim 2026 Perşembe
  {
    id: 'tech-istanbul-ai-ders-10',
    title: '🏆 Tech Istanbul AI Bootcamp: Mezuniyet, Proje Sunumları & Kapanış',
    description: `Uygulamalı Yapay Zekâ Geliştirme Bootcamp'i Final Oturumu! 🎓

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Oturum
⏰ Saat: 16:00 – 20:00
📅 Tarih: 8 Ekim 2026 Perşembe

📌 Oturum Kapsamı:
• Geliştirilen Yapay Zekâ / RAG / Agent projelerinin canlı sunumları ve demoları
• Mentor ve eğitmen heyeti değerlendirmeleri, geri bildirim oturumu
• Tech Istanbul Yapay Zekâ Geliştirici sertifikasyon süreci ve kariyer fırsatları
• Mezuniyet kutlaması ve kapanış`,
    startDate: '2026-10-08T16:00:00',
    endDate: '2026-10-08T20:00:00',
    allDay: false,
    location: 'Online Canlı Eğitim (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'milestone',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'critical',
    tags: ['Tech Istanbul', 'Bootcamp', 'Mezuniyet', 'Demo Day', 'Sertifika'],
    deliverables: [
      { id: 'ti-del-20', text: 'Bitirme projesi sunumumu gerçekleştirdim', completed: false },
      { id: 'ti-del-21', text: 'Tech Istanbul Bootcamp sertifika başvurumu tamamladım', completed: false }
    ]
  },

  // =========================================================================
  // Prompt Engineering 2.0 (Multimodal) Atölyesi (16 Eylül - 7 Ekim 2026)
  // Her Çarşamba 16:00 - 20:00 | Online Canlı Atölye
  // =========================================================================

  // 1. Oturum - 16 Eylül 2026 Çarşamba
  {
    id: 'tech-istanbul-prompt-eng-1',
    title: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) - 1. Oturum',
    description: `Prompt Engineering 2.0 (Multimodal) Atölyesi Başlangıç Oturumu! 🎉

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Atölye
⏰ Saat: 16:00 – 20:00
📅 Tarih: 16 Eylül 2026 Çarşamba

📌 Atölye Kapsamı:
• İleri Düzey Prompt Yazım Teknikleri (Few-Shot, CoT, Role-Prompting)
• LLM Tokenization, Context Window ve Sistem Talimatları (System Instructions)
• Yapılandırılmış Çıktı Üretimi ve Parametre Optimizasyonu (Temperature, Top-P)
• Uygulamalı Canlı Senaryolar & Prompt Şablonu Tasarımı

🔗 Eğitim bağlantısı ve katılım linki Tech Istanbul tarafından e-posta ile paylaşılacaktır.`,
    startDate: '2026-09-16T16:00:00',
    endDate: '2026-09-16T20:00:00',
    allDay: false,
    location: 'Online Canlı Atölye (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Prompt Engineering', 'Multimodal', 'Atölye', 'GenAI', 'P1'],
    deliverables: [
      { id: 'ti-pe-del-1', text: '[Hazırlık]: Online eğitim ortamı ve LLM araçları (Gemini, Claude, GPT) hazırlandı; bağlantı linki kontrol edildi.', completed: false },
      { id: 'ti-pe-del-2', text: '[Uygulama]: 16:00 – 20:00 canlı atölye oturumuna katılındı, ileri prompt teknikleri uygulandı.', completed: false },
      { id: 'ti-pe-del-3', text: '[Teslimat / Takip]: Atölye prompt kütüphanesi notları derlendi ve GitHub reposuna kaydedildi.', completed: false }
    ]
  },

  // 2. Oturum - 23 Eylül 2026 Çarşamba
  {
    id: 'tech-istanbul-prompt-eng-2',
    title: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) - 2. Oturum',
    description: `Prompt Engineering 2.0 (Multimodal) Atölyesi 2. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Atölye
⏰ Saat: 16:00 – 20:00
📅 Tarih: 23 Eylül 2026 Çarşamba

📌 Atölye Kapsamı:
• Çok Modlu (Multimodal) AI Modellerinin Mimarisi (Görsel, Ses, Metin Girdileri)
• Doküman ve Çizim Analizi için Gelişmiş Görsel Promptlama (Visual Prompting)
• Ses ve Video Verilerinden Bilgi Çıkarımı ve Özetleme
• Multimodal Senaryolarda Hata Ayıklama ve Halüsinasyon Kontrolü`,
    startDate: '2026-09-23T16:00:00',
    endDate: '2026-09-23T20:00:00',
    allDay: false,
    location: 'Online Canlı Atölye (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'Prompt Engineering', 'Multimodal AI', 'Görsel Prompting', 'P1'],
    deliverables: [
      { id: 'ti-pe-del-4', text: '[Hazırlık]: Çok modlu test veri setleri (grafik, PDF, ses) hazırlandı.', completed: false },
      { id: 'ti-pe-del-5', text: '[Uygulama]: Multimodal AI promptlama pratikleri ve görsel analiz çalışmaları tamamlandı.', completed: false },
      { id: 'ti-pe-del-6', text: '[Teslimat / Takip]: Çok modlu çıktı şablonları derlendi ve dokümantasyona işlendi.', completed: false }
    ]
  },

  // 3. Oturum - 30 Eylül 2026 Çarşamba
  {
    id: 'tech-istanbul-prompt-eng-3',
    title: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) - 3. Oturum',
    description: `Prompt Engineering 2.0 (Multimodal) Atölyesi 3. Oturumu

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Atölye
⏰ Saat: 16:00 – 20:00
📅 Tarih: 30 Eylül 2026 Çarşamba

📌 Atölye Kapsamı:
• Üretken Yapay Zekâ ile Profesyonel İçerik Üretimi Pipeline'ı
• İş Süreçlerinin Optimizasyonu (Raporlama, Kod Analizi, E-posta ve Veri Sentezi)
• Prompt Zincirleme (Prompt Chaining) ve Çok Aşamalı İş Akışları
• AI Araçlarının Entegrasyonu ve Verimlilik Taktikleri`,
    startDate: '2026-09-30T16:00:00',
    endDate: '2026-09-30T20:00:00',
    allDay: false,
    location: 'Online Canlı Atölye (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'workshop',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'high',
    tags: ['Tech Istanbul', 'İçerik Üretimi', 'İş Akışı Optimizasyonu', 'Prompt Chaining', 'P1'],
    deliverables: [
      { id: 'ti-pe-del-7', text: '[Hazırlık]: Süreç optimizasyonu için örnek vaka senaryosu belirlendi.', completed: false },
      { id: 'ti-pe-del-8', text: '[Uygulama]: 16:00 – 20:00 oturumunda çok aşamalı prompt zinciri kurgulandı.', completed: false },
      { id: 'ti-pe-del-9', text: '[Teslimat / Takip]: Hazırlanan iş akışı optimizasyon şablonu paylaşıldı.', completed: false }
    ]
  },

  // 4. Oturum - 7 Ekim 2026 Çarşamba (Final & Kapanış)
  {
    id: 'tech-istanbul-prompt-eng-4',
    title: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) - 4. Oturum (Final)',
    description: `Prompt Engineering 2.0 (Multimodal) Atölyesi Kapanış & Final Oturumu! 🎓

🏢 Organizasyon: Tech Istanbul Ekibi
💻 Format: Online Canlı Atölye
⏰ Saat: 16:00 – 20:00
📅 Tarih: 7 Ekim 2026 Çarşamba

📌 Atölye Kapsamı:
• Katılımcı Uygulamalı Proje Sunumları ve Canlı Demolar
• Sektörel Kullanım Senaryoları ve En İyi Uygulamalar (Best Practices)
• Eğitmen Değerlendirmeleri ve Geri Bildirim
• Atölye Tamamlama Sertifikasyonu ve Kapanış`,
    startDate: '2026-10-07T16:00:00',
    endDate: '2026-10-07T20:00:00',
    allDay: false,
    location: 'Online Canlı Atölye (Tech Istanbul)',
    link: 'https://tech.istanbul',
    type: 'milestone',
    program: 'tech-istanbul-bootcamp',
    isMandatory: true,
    color: '#0284c7',
    reminderMinutes: 120,
    priority: 'critical',
    tags: ['Tech Istanbul', 'Prompt Engineering', 'Final Sunumu', 'Sertifika', 'P1'],
    deliverables: [
      { id: 'ti-pe-del-10', text: '[Hazırlık]: Final prompt mühendisliği mini projesi ve sunum demosu hazırlandı.', completed: false },
      { id: 'ti-pe-del-11', text: '[Uygulama]: 16:00 – 20:00 final oturumunda proje sunumu gerçekleştirildi.', completed: false },
      { id: 'ti-pe-del-12', text: '[Teslimat / Takip]: Atölye katılım ve başarı sertifikası teslim alındı.', completed: false }
    ]
  }
];
