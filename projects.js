// Edit this file to add or change projects. Everything on the page is generated from it.
// status: "shipped" = finished project, "next" = planned (shown with a "Next up" badge).
// links: add { github: "https://...", live: "https://..." } only where they exist; buttons appear automatically.

window.FEATURED = [
  {
    id: "procura",
    status: "shipped",
    title: "Procura AI: procurement review where the AI never decides",
    tagline: "An assistant that checks purchase requests against company policy and hands a reviewer an evidence-backed assessment. A person always makes the decision, and the database enforces it.",
    metric: "0 false approvals across 40 test scenarios",
    tags: ["FastAPI", "Postgres + pgvector", "RAG", "LLM evaluation", "React + TypeScript"],
    pipeline: ["Documents", "Rules + policy retrieval", "LLM reasoning, schema-checked", "Evidence verifier", "Human decision"],
    sections: [
      { h: "Problem", t: "Reviewing purchase requests against long policy documents is slow and inconsistent, which makes it tempting to let an AI approve them. That is the wrong product: a wrong approval spends real money, and a language model can state a violation that does not exist or miss one that does. So the rule came first: the AI advises, a person decides, and the system must make the opposite impossible, not just unlikely." },
      { h: "What it does", t: "It reads quotations and requests, retrieves the policy clauses that apply, runs deterministic checks, and asks a language model only about judgement calls. Every finding quotes the clause it relies on. Only deterministic rules may mark a confirmed violation; the model can at most raise a potential or inconclusive finding. The reviewer sees the assessment and, separately, their own decision panel." },
      { h: "Key decisions", t: "Rules first, model second. Database triggers keep the audit log append-only, make assessments and decisions immutable, and refuse to mark a request approved without a matching human decision. An evidence verifier drops any model claim that does not quote a clause it was shown or that introduces numbers the evidence does not contain. Retrieval, thresholds and prompts were chosen from benchmarks on frozen, labelled data, not by intuition." },
      { h: "Measured results", t: "On synthetic data: plain vector search beat keyword search and hybrid fusion (MRR 0.790 against 0.585 and 0.670 on 35 held-out questions). The deterministic rules found all 35 expected findings in 40 scenarios with no false alarms. No gold violation was approved (0 of 12; with a sample that small, the 95% interval still allows up to 24%). With a real model (gpt-oss-120b on Groq) three repeat runs had zero failed calls and zero false approvals, but the model's own potential-violation findings varied from run to run (4, 3, 2)." },
      { h: "What went wrong", t: "My first prompt made the model raise 29 speculative violations; the revised prompt cut that to between 1 and 4, and I corrected my own earlier claim after repeating the runs. A smaller model invented figures in 3 of 49 claims and the verifier caught all three. My first duplicate detector flagged every legitimate reorder. A test assertion I had written could never fail. A benchmark document cited a figure that the report file contradicted. Each is documented and fixed." },
      { h: "Limits", t: "All data is synthetic and the rules share an author with the test scenarios, so results show behaviour on this corpus, not on real documents. The live demo is a recorded, read-only snapshot with the keyword-based mock AI, not a running backend. Sign-in is a demo persona picker, not real authentication. Not load-tested, no scanned documents, no browser end-to-end tests." },
      { h: "Related project", t: "I also built a procurement AI agent on Microsoft Azure. The two projects take different routes to the same domain: the Azure agent runs on Microsoft's cloud, while Procura is built from scratch so every layer can be tested and measured." },
      { h: "Try it", t: "Open the live demo to browse the review queue, an AI assessment with its evidence, the separate human decision panel, vendors, analytics and the audit log. The full app, with creating requests, live policy search and recording decisions, runs locally (setup is in the README). The repository includes a full write-up with every figure traced to a report file." }
    ],
    links: { github: "https://github.com/mazenkarim20033-arch/procura-ai", live: "https://mazenkarim20033-arch.github.io/procura-ai/" }
  },
  {
    id: "sentinel",
    status: "shipped",
    title: "SENTINEL: predictive maintenance with an evaluation you can check",
    tagline: "Estimates how many cycles a machine has left, warns early, says how uncertain it is, and explains itself. Built on NASA's simulated turbofan data, with a replay screen in which the model never sees the future.",
    metric: "Test RMSE 13.8 cycles against 43.1 for a constant guess (FD001)",
    tags: ["Python", "LightGBM", "PyTorch", "SHAP", "Conformal prediction", "FastAPI", "React + TypeScript"],
    pipeline: ["Engine sensor histories", "Per-regime normalisation, causal windows", "LightGBM, GRU, LSTM", "Conformal intervals + SHAP", "Replay UI that hides the future"],
    sections: [
      { h: "Problem", t: "Servicing a machine too early wastes useful life; too late risks failure. Most predictive-maintenance demos report one accuracy number, often inflated by leakage between training and test data. I wanted the opposite: a system where every claim can be checked, including the claims about what it does not do." },
      { h: "What it does", t: "On NASA's simulated C-MAPSS engines it estimates remaining cycles, raises warning levels, flags unusual sensor behaviour, gives 80% and 90% intervals, and explains each prediction with SHAP. A web app shows the whole fleet on one remaining-life axis, and a replay lab steps through an engine cycle by cycle: the server cuts the history before the model runs, and a blind mode hides the true answer. Every figure is labelled as a prediction, ground truth, dataset signal or recorded benchmark." },
      { h: "Key decisions", t: "Engines are split by engine, never by row. Preprocessing is fitted on training engines only and normalised per operating regime. Windows are causal, with tests that change later rows and check earlier predictions do not move. Official test sets were evaluated once per final configuration and nothing was tuned on them. LightGBM is the default because it matches the deeper models within error at a fraction of the cost, not because they were shown to be worse. The pipeline is config-driven, so the same code ran on a second, non-engine dataset (batteries)." },
      { h: "Measured results", t: "On the official test sets, LightGBM reaches RMSE 13.75 cycles on FD001 (95% interval 11.6 to 15.6; a constant guess scores 43.1) and 25.65 on the hardest subset FD004 (22.8 to 28.2). LightGBM, Random Forest, GRU and LSTM are statistically indistinguishable on these test sets. In development, warnings at 30 cycles reached precision 0.97 and recall 0.83 with a median of 25 cycles of notice. Raw quantile intervals covered only 50 to 62% of cases when 80% was promised; conformal calibration fixed the average but stayed weak in mid-life, and the interface says so." },
      { h: "What went wrong", t: "A large gap between development and test error first looked like leakage. Diagnosing it showed my development metric had understated the test error, because the test set holds more engines with long remaining life, which a model trained on a 125-cycle cap cannot reach. Testing the whole stack found that an extreme sensor value crashed the API and that the first dashboard load took up to 25 seconds; a real-browser audit found contrast and labelling failures. All were fixed, and several of my own tests turned out to be wrong, including an assertion that could never fail." },
      { h: "Limits", t: "All data is simulated, so nothing here shows the methods work on real engines. A model trained on single-condition data failed on six-condition data (RMSE 56 to 61, worse than a constant guess), so models do not transfer without retraining. Deep models were tried on one dataset and not tuned. The battery result is four cells with no test set. Anomaly accuracy is known only for injected faults. There is no authentication or monitoring, and the public demo plays back recorded model output rather than running live." },
      { h: "Try it", t: "Open the live demo and use the Simulation lab: pick Evaluation mode to see the prediction, its interval and the ground truth side by side, or Blind mode to see only what an operator would. The repository has the case study, model card, dataset card, limitations, an interview guide, 200 automated tests and a generated report with every number traced to a run record." }
    ],
    links: { github: "https://github.com/mazenkarim20033-arch/sentinel-predictive-maintenance", live: "https://mazenkarim20033-arch.github.io/sentinel-predictive-maintenance/" }
  },
  {
    id: "azure-agent",
    status: "shipped",
    title: "Procurement AI Agent on Microsoft Azure",
    tagline: "An AI agent assistant for procurement tasks, designed and built on Microsoft Azure.",
    metric: "Built on Microsoft Azure",
    tags: ["Microsoft Azure", "AI agents", "Cloud", "Procurement"],
    pipeline: [],
    sections: [
      { h: "Goal", t: "Design and build an AI agent assistant that helps with procurement tasks, running on Microsoft Azure's cloud and AI agent capabilities." },
      { h: "Platform", t: "Microsoft Azure. I also worked with Azure and Dataiku during my internship at BBI, where I built and presented hands-on projects." },
      { h: "Two takes on one domain", t: "Procura AI, my other procurement project, takes the opposite route: it is built from scratch (FastAPI, Postgres, my own evaluation harness) so every layer can be tested and measured. Together they show the same problem solved on a cloud platform and as a custom-built, evaluated system." }
    ]
  }

];

window.EARLIER = [
  {
    id: "cairo",
    status: "shipped",
    title: "Cairo House Price Predictor",
    tagline: "Regression model that estimates property prices from location, size and features, deployed as a web app.",
    metric: "Random Forest beat the linear baseline",
    tags: ["scikit-learn", "Pandas", "Streamlit"],
    pipeline: ["Property data", "Preprocessing", "Linear baseline", "Random Forest", "Streamlit app"],
    sections: [
      { h: "Problem", t: "Real estate prices in Cairo vary widely with location, size and property characteristics. The goal was a model that estimates price from structured property data." },
      { h: "Approach", t: "Full pipeline from data preparation to deployment. I started with Linear Regression as a baseline, then tried a Random Forest Regressor, which captured non-linear relationships far better." },
      { h: "Key decisions", t: "Start simple to set a baseline, identify where it fails on non-linear feature interactions, switch to an ensemble, and choose the final model by empirical comparison rather than preference." },
      { h: "Evaluation", t: "Compared both models on RMSE, MAE and R². Random Forest achieved significantly better predictive accuracy." },
      { h: "Deployment", t: "Shipped as a Streamlit app where users enter property details and get a price estimate in real time." },
      { h: "What I learned", t: "Why a baseline comes first, how ensembles help on non-linear data, the trade-off between simplicity and accuracy, and the end-to-end workflow of shipping an ML system." }
    ]
  },
  {
    id: "faces",
    status: "shipped",
    title: "Celebrity Face Recognition",
    tagline: "Deep learning image classifier that recognizes 18 celebrities, served through a web interface.",
    metric: "18 classes",
    tags: ["TensorFlow / Keras", "OpenCV", "Streamlit"],
    pipeline: ["Image dataset", "Preprocessing + augmentation", "CNN features", "Classifier", "Streamlit app"],
    sections: [
      { h: "Problem", t: "Identify and classify images of celebrities across multiple classes." },
      { h: "Approach", t: "Trained a computer vision classifier on a dataset of 18 celebrities. Applied image preprocessing and data augmentation to generalize better, and used a deep learning approach for feature extraction and classification." },
      { h: "Result", t: "A working image classification system that recognizes multiple identities, with a deployed interactive interface." }
    ]
  },
  {
    id: "chatbot",
    status: "shipped",
    title: "AI Chatbot",
    tagline: "Real-time conversational app built on the Groq API with LLaMA 3 models and session memory.",
    metric: "Groq + LLaMA 3",
    tags: ["Groq API", "LLaMA 3", "Streamlit"],
    pipeline: ["User message", "Session memory", "Groq API", "LLaMA 3", "Streamlit chat UI"],
    sections: [
      { h: "Overview", t: "An interactive chatbot web app in Python and Streamlit that holds real-time conversations and keeps chat history through session-based memory." },
      { h: "Features", t: "Fast inference on Groq-hosted LLaMA models, a clean chat UI, conversation memory, and API keys kept in environment secrets rather than in code." },
      { h: "What I learned", t: "Integrating LLMs into applications, working with APIs and authentication, managing conversational state in web apps, and handling secure configuration." }
    ]
  },
  {
    id: "salary",
    status: "shipped",
    title: "Tech Salary Predictor",
    tagline: "Regression model that estimates tech salaries from job features.",
    metric: "Regression on job listings",
    tags: ["scikit-learn", "Pandas", "Streamlit"],
    pipeline: ["Job listings", "Cleaning", "Preprocessing", "Regression", "Streamlit app"],
    sections: [
      { h: "Problem", t: "Predict salaries in the tech industry from job-related features." },
      { h: "Approach", t: "Cleaned and analyzed a dataset of tech job listings, applied preprocessing, trained regression models to estimate salary ranges, and evaluated them with standard regression metrics." },
      { h: "Result", t: "A model that estimates tech salaries with reasonable accuracy from input job features." }
    ]
  },
  {
    id: "social",
    status: "shipped",
    title: "Social Media Impact Analysis",
    tagline: "Text classifier predicting whether social media use affects students' academic life positively, neutrally or negatively.",
    metric: "3-class NLP classifier",
    tags: ["scikit-learn", "NLP", "Streamlit"],
    pipeline: ["Survey text", "Cleaning + preprocessing", "Feature extraction", "Classifier", "Streamlit app"],
    sections: [
      { h: "Problem", t: "Predict whether social media usage has a positive, neutral or negative impact on students' academic life." },
      { h: "Approach", t: "Built a supervised model on text features: data cleaning, text preprocessing and feature extraction before training classification models." },
      { h: "Result", t: "A reliable classifier that categorizes social media impact from user input." }
    ]
  }
];
