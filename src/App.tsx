import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  FileText,
  Layers,
  MessageSquare,
  RefreshCw,
  Play,
  ArrowRight,
  Edit2,
  Trash2,
  HelpCircle,
  Clock,
  Cpu,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Analysis {
  core_message: string;
  audience: string;
  tone: string;
}

interface Slide {
  slide: number;
  headline: string;
  body: string;
}

interface RepurposeResult {
  analysis: Analysis;
  carousel_outline: Slide[];
  short_form: string;
  comment_hooks: string[];
}

const SAMPLE_POSTS = [
  {
    title: "💡 $1M ARR Journey",
    text: `I just spent 4 years building a company and we finally hit $1M ARR. Here are the 10 hardest lessons I learned about product-market fit, hiring the first 5 people, and knowing when to pivot.

When we started in 2020, we thought the solution was purely technical. We spent 6 months building a feature nobody asked for. It wasn't until we talked to 50 customers in 10 days that we realized the real pain point was data integration, not visualization.

Lesson 1: Talk to your users before writing code.
Lesson 2: Your first 5 hires must be generalists who embrace ambiguity, not specialists.
Lesson 3: If you can't describe your value in 1 sentence, you don't understand it.

We failed 3 times before hitting this milestone. PMF is not a straight line.`
  },
  {
    title: "🧘 Tech Burnout & Focus",
    text: `I worked 80-hour weeks for three years. I thought constant busyness meant productivity.

Then, my health collapsed. I spent a week in the hospital with severe exhaustion.

That was my wake-up call. I completely restructured my day:
- Strict 8-hour workday (no exceptions)
- Deep work blocks of 90 minutes with zero notifications
- 10-minute walks between blocks
- Turning off all work screens by 7:00 PM

Result? In the last 12 months, my team's output doubled, our revenue increased by 40%, and I have never felt more creative. Busyness is a lazy substitute for deep focus. Protect your energy.`
  },
  {
    title: "🎨 Design Minimalism",
    text: `The best product design is often the one you don't notice.

We redesigned our user registration flow last month. The old page had 12 input fields, two selection boxes, and a Captcha. It took users an average of 3 minutes to sign up, and we had a 34% drop-off rate.

We cut it down to just 2 fields: Email and Password. We offloaded everything else to the onboarding flow after login.

The outcome:
- Signup drop-off dropped to 4%
- Total signups increased by 42% in 2 weeks
- Customer satisfaction rating reached an all-time high of 96%

True craft doesn't mean adding features — it means having the courage to strip away everything that isn't absolutely necessary.`
  }
];

export default function App() {
  const [postText, setPostText] = useState(SAMPLE_POSTS[0].text);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  // Copy states
  const [copiedSlideIndex, setCopiedSlideIndex] = useState<number | null>(null);
  const [copiedAllSlides, setCopiedAllSlides] = useState(false);
  const [copiedShortForm, setCopiedShortForm] = useState(false);
  const [copiedCommentIndex, setCopiedCommentIndex] = useState<number | null>(null);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);

  // Edit states for generated outputs
  const [isEditingCoreMessage, setIsEditingCoreMessage] = useState(false);
  const [editedCoreMessage, setEditedCoreMessage] = useState('');

  const [isEditingAudience, setIsEditingAudience] = useState(false);
  const [editedAudience, setEditedAudience] = useState('');

  const [isEditingTone, setIsEditingTone] = useState(false);
  const [editedTone, setEditedTone] = useState('');

  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [editedSlideHeadline, setEditedSlideHeadline] = useState('');
  const [editedSlideBody, setEditedSlideBody] = useState('');

  const [isEditingShortForm, setIsEditingShortForm] = useState(false);
  const [editedShortForm, setEditedShortForm] = useState('');

  const [editingCommentIndex, setEditingCommentIndex] = useState<number | null>(null);
  const [editedCommentValue, setEditedCommentValue] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Loading stages sequence helper
  useEffect(() => {
    if (!isLoading) return;

    const stages = [
      'Parsing source post layout...',
      'Analyzing core message & target audience...',
      'Drafting hook and story beats for carousel...',
      'Refining carousel slide outlines...',
      'Synthesizing punchy short-form draft...',
      'Generating discussion-starter comment hooks...',
      'Finalizing high-density content cards...'
    ];

    let currentStage = 0;
    setLoadingStage(stages[0]);

    const interval = setInterval(() => {
      currentStage = (currentStage + 1) % stages.length;
      setLoadingStage(stages[currentStage]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Initial demo data seed on mount so the app isn't blank
  useEffect(() => {
    // Generate initial structured repurpose for $1M ARR post on first load
    setResult({
      analysis: {
        core_message: "Customer feedback is the only real shortcut to PMF; technical assumptions are liabilities.",
        audience: "Early-stage Founders & Builders",
        tone: "Reflective, Direct & Actionable"
      },
      carousel_outline: [
        {
          slide: 1,
          headline: "We hit $1M ARR. Here is everything we did wrong.",
          body: "4 years. 3 major failures. 1 key realization. Stop guessing. Start building what actually matters."
        },
        {
          slide: 2,
          headline: "The 6-Month Hallucination",
          body: "We built an elaborate visualization feature in a vacuum. Cost: 6 months. Users who wanted it: Exactly zero."
        },
        {
          slide: 3,
          headline: "The Zoom Breakthrough",
          body: "We stopped coding. We scheduled 50 customer calls in 10 days. The real pain point? Data integration, not charts."
        },
        {
          slide: 4,
          headline: "The First 5 Hires Metric",
          body: "Don't hire specialist specialists too early. You need scrappy generalists who embrace ambiguity and pivot fast."
        },
        {
          slide: 5,
          headline: "Describe it in 1 Sentence",
          body: "If you cannot explain your product value to a toddler, you do not understand it. Keep it simple or fail."
        },
        {
          slide: 6,
          headline: "The Pivot is Not a Straight Line",
          body: "PMF is a messy, circular journey of continuous listening. Build. Talk. Measure. Repeat."
        }
      ],
      short_form: "We just hit $1M ARR. But the first 12 months were a disaster.\n\nWe spent 6 months building in a total vacuum. No user input, just our own tech assumptions.\n\nThe pivot that saved us? Talking to 50 customers in 10 days.\n\nPMF is never found in code. It is found in conversations.\n\nStop guessing. Start asking.",
      comment_hooks: [
        "Which hire was your hardest during the scale to your first million ARR?",
        "PMF or high-quality team: What comes first on your startup priority list?",
        "What is one product pivot that absolutely saved your business from failure?"
      ]
    });
    setLatencyMs(452);
  }, []);

  const handleRepurpose = async () => {
    if (!postText.trim()) {
      setError("Please paste some content first!");
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch('/api/repurpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postText })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server returned an error.');
      }

      const data = await response.json();
      setResult(data);
      const endTime = performance.now();
      setLatencyMs(Math.round(endTime - startTime));
      showToast("✨ Content repurposed successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helpers
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyAllSlides = () => {
    if (!result) return;
    const slidesText = result.carousel_outline
      .map(s => `[SLIDE ${s.slide}]
Headline: ${s.headline}
Body: ${s.body}`)
      .join('\n\n');
    copyToClipboard(slidesText);
    setCopiedAllSlides(true);
    showToast("📋 Copied all slide outlines to clipboard!");
    setTimeout(() => setCopiedAllSlides(false), 2000);
  };

  const handleCopySingleSlide = (slide: Slide, index: number) => {
    const text = `[SLIDE ${slide.slide}]
Headline: ${slide.headline}
Body: ${slide.body}`;
    copyToClipboard(text);
    setCopiedSlideIndex(index);
    showToast(`📋 Copied Slide ${slide.slide} layout!`);
    setTimeout(() => setCopiedSlideIndex(null), 2000);
  };

  const handleCopyShortForm = () => {
    if (!result) return;
    copyToClipboard(result.short_form);
    setCopiedShortForm(true);
    showToast("📋 Copied short-form draft to clipboard!");
    setTimeout(() => setCopiedShortForm(false), 2000);
  };

  const handleCopyComment = (hook: string, index: number) => {
    copyToClipboard(hook);
    setCopiedCommentIndex(index);
    showToast("📋 Copied comment hook!");
    setTimeout(() => setCopiedCommentIndex(null), 2000);
  };

  const handleCopyAnalysis = () => {
    if (!result) return;
    const text = `Core Message: ${result.analysis.core_message}
Target Audience: ${result.analysis.audience}
Tone Profile: ${result.analysis.tone}`;
    copyToClipboard(text);
    setCopiedAnalysis(true);
    showToast("📋 Copied core message and audience analysis!");
    setTimeout(() => setCopiedAnalysis(false), 2000);
  };

  // Editing helpers
  const startEditSlide = (slide: Slide, index: number) => {
    setEditingSlideIndex(index);
    setEditedSlideHeadline(slide.headline);
    setEditedSlideBody(slide.body);
  };

  const saveEditedSlide = (index: number) => {
    if (!result) return;
    const updatedOutline = [...result.carousel_outline];
    updatedOutline[index] = {
      ...updatedOutline[index],
      headline: editedSlideHeadline,
      body: editedSlideBody
    };
    setResult({ ...result, carousel_outline: updatedOutline });
    setEditingSlideIndex(null);
    showToast("✏️ Slide updated.");
  };

  const saveCoreMessage = () => {
    if (!result) return;
    setResult({
      ...result,
      analysis: {
        ...result.analysis,
        core_message: editedCoreMessage
      }
    });
    setIsEditingCoreMessage(false);
    showToast("✏️ Core message updated.");
  };

  const saveAudience = () => {
    if (!result) return;
    setResult({
      ...result,
      analysis: {
        ...result.analysis,
        audience: editedAudience
      }
    });
    setIsEditingAudience(false);
    showToast("✏️ Target audience updated.");
  };

  const saveTone = () => {
    if (!result) return;
    setResult({
      ...result,
      analysis: {
        ...result.analysis,
        tone: editedTone
      }
    });
    setIsEditingTone(false);
    showToast("✏️ Tone profile updated.");
  };

  const saveEditedShortForm = () => {
    if (!result) return;
    setResult({
      ...result,
      short_form: editedShortForm
    });
    setIsEditingShortForm(false);
    showToast("✏️ Short-form draft updated.");
  };

  const startEditComment = (hook: string, index: number) => {
    setEditingCommentIndex(index);
    setEditedCommentValue(hook);
  };

  const saveEditedComment = (index: number) => {
    if (!result) return;
    const updatedHooks = [...result.comment_hooks];
    updatedHooks[index] = editedCommentValue;
    setResult({ ...result, comment_hooks: updatedHooks });
    setEditingCommentIndex(null);
    showToast("✏️ Comment hook updated.");
  };

  const wordCount = (text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] text-[#0f172a] font-sans antialiased overflow-hidden select-none">
      {/* Toast Notification Pop-up */}
      {toastMessage && (
        <div id="copy-toast" className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xl border border-slate-800 transition-all transform animate-bounce">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header id="main-header" className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              Post Repurposer
              <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded-full border border-slate-200">v1.2</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Quick template selection */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Load Example:</span>
            {SAMPLE_POSTS.map((sample, idx) => (
              <button
                key={idx}
                id={`btn-sample-${idx}`}
                onClick={() => {
                  setPostText(sample.text);
                  setError(null);
                  showToast(`Loaded "${sample.title.split(' ')[1]}" draft`);
                }}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-all ${
                  postText === sample.text
                    ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {sample.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[11px] font-bold uppercase tracking-wider">Agent Ready</span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main id="main-layout" className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-4 overflow-hidden bg-[#f8fafc]">
        
        {/* Left Column (col-span-4): Source input & Core Reasoning */}
        <section id="column-left" className="col-span-1 md:col-span-4 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Top Half: Input Area */}
          <div id="card-source-input" className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm h-1/2 overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source Input</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {wordCount(postText)} Words | {postText.length} Chars
              </span>
            </div>
            
            <div className="flex-1 relative overflow-hidden bg-slate-50 rounded-lg border border-slate-100 flex flex-col">
              <textarea
                id="textarea-post"
                value={postText}
                onChange={(e) => {
                  setPostText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your long-form LinkedIn post here..."
                className="w-full flex-1 p-3 text-xs leading-relaxed text-slate-600 outline-none resize-none bg-transparent overflow-y-auto"
                disabled={isLoading}
              />
              {postText && (
                <button
                  id="btn-clear-input"
                  onClick={() => setPostText('')}
                  className="absolute bottom-2 right-2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              id="btn-repurpose"
              onClick={handleRepurpose}
              disabled={isLoading}
              className="w-full shrink-0 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Repurposing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Repurpose Content</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom Half: Core Reasoning */}
          <div id="card-core-reasoning" className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3.5 shadow-sm h-1/2 overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Core Reasoning</span>
              </div>
              {result && (
                <button
                  id="btn-copy-analysis"
                  onClick={handleCopyAnalysis}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  {copiedAnalysis ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAnalysis ? "COPIED" : "COPY"}</span>
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <div className="absolute w-full h-full border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-slate-700">Gemini is reasoning...</p>
                  <p className="text-[10px] text-slate-400 mt-1 italic animate-pulse">{loadingStage}</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex-1 p-4 bg-red-50 rounded-lg border border-red-100 flex flex-col justify-center items-center text-center gap-2">
                <span className="text-red-500 font-bold text-xs">Analysis Failed</span>
                <p className="text-[11px] text-red-600 leading-relaxed max-w-xs">{error}</p>
                <button
                  id="btn-error-retry"
                  onClick={handleRepurpose}
                  className="mt-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-[10px] font-bold uppercase rounded"
                >
                  Retry API Request
                </button>
              </div>
            ) : result ? (
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-0.5">
                {/* Core Message block */}
                <div className="bg-indigo-50/70 border-l-4 border-indigo-500 p-3 rounded-r-lg group relative">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-indigo-900">Core Message</h3>
                    <button
                      id="btn-edit-core-message"
                      onClick={() => {
                        if (isEditingCoreMessage) {
                          saveCoreMessage();
                        } else {
                          setEditedCoreMessage(result.analysis.core_message);
                          setIsEditingCoreMessage(true);
                        }
                      }}
                      className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {isEditingCoreMessage ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3 h-3" />}
                    </button>
                  </div>
                  {isEditingCoreMessage ? (
                    <textarea
                      id="edit-textarea-core"
                      value={editedCoreMessage}
                      onChange={(e) => setEditedCoreMessage(e.target.value)}
                      className="w-full bg-white border border-indigo-200 rounded p-1.5 text-xs text-indigo-900 leading-snug outline-none resize-none focus:ring-1 focus:ring-indigo-500"
                      rows={2}
                    />
                  ) : (
                    <p className="text-[11.5px] font-semibold text-indigo-950 leading-snug">
                      {result.analysis.core_message}
                    </p>
                  )}
                </div>

                {/* Grid for Audience and Tone */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 group relative">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Audience</h3>
                      <button
                        id="btn-edit-audience"
                        onClick={() => {
                          if (isEditingAudience) {
                            saveAudience();
                          } else {
                            setEditedAudience(result.analysis.audience);
                            setIsEditingAudience(true);
                          }
                        }}
                        className="text-slate-500 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isEditingAudience ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3 h-3" />}
                      </button>
                    </div>
                    {isEditingAudience ? (
                      <input
                        id="edit-input-audience"
                        value={editedAudience}
                        onChange={(e) => setEditedAudience(e.target.value)}
                        onBlur={saveAudience}
                        onKeyDown={(e) => e.key === 'Enter' && saveAudience()}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 outline-none focus:border-indigo-400"
                        autoFocus
                      />
                    ) : (
                      <p className="text-[11.5px] font-bold text-slate-700 truncate">
                        {result.analysis.audience}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 group relative">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tone</h3>
                      <button
                        id="btn-edit-tone"
                        onClick={() => {
                          if (isEditingTone) {
                            saveTone();
                          } else {
                            setEditedTone(result.analysis.tone);
                            setIsEditingTone(true);
                          }
                        }}
                        className="text-slate-500 hover:text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {isEditingTone ? <Check className="w-3.5 h-3.5" /> : <Edit2 className="w-3 h-3" />}
                      </button>
                    </div>
                    {isEditingTone ? (
                      <input
                        id="edit-input-tone"
                        value={editedTone}
                        onChange={(e) => setEditedTone(e.target.value)}
                        onBlur={saveTone}
                        onKeyDown={(e) => e.key === 'Enter' && saveTone()}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 outline-none focus:border-indigo-400"
                        autoFocus
                      />
                    ) : (
                      <p className="text-[11.5px] font-bold text-slate-700 truncate">
                        {result.analysis.tone}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Additional Agent Intelligence Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-[10px] text-slate-500 leading-relaxed mt-auto">
                  <span className="font-bold block text-slate-600 mb-0.5">💡 Strategy Insight:</span>
                  The agent selects highly targeted hooks corresponding to {result.analysis.audience || "your target market"}. The tone profile is optimized for maximum algorithm amplification.
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 text-xs italic">Submit content above to generate reasoning</span>
              </div>
            )}
          </div>
        </section>

        {/* Middle Column (col-span-5): Carousel Outline */}
        <section id="column-middle" className="col-span-1 md:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Carousel Outline</span>
            </div>
            {result && (
              <button
                id="btn-copy-all-slides"
                onClick={handleCopyAllSlides}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
              >
                {copiedAllSlides ? "ALL COPIED!" : "COPY ALL SLIDES"}
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Assembling slide visual layers...</p>
              </div>
            ) : result ? (
              <div className="space-y-3">
                {result.carousel_outline.map((slide, index) => {
                  const isEditing = editingSlideIndex === index;
                  const isHook = index === 0;
                  const isCTA = index === result.carousel_outline.length - 1;
                  const typeLabel = isHook ? "HOOK" : isCTA ? "CTA" : "BODY";

                  return (
                    <div
                      key={index}
                      id={`slide-card-${index}`}
                      className="group border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors bg-white p-3 flex flex-col gap-2 relative"
                    >
                      <div className="flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[9px] font-bold">
                            SLIDE {slide.slide}
                          </span>
                          <span className={`text-[9px] font-bold px-1 rounded ${
                            isHook ? 'bg-indigo-50 text-indigo-700' : isCTA ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'
                          }`}>
                            {typeLabel}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`btn-edit-slide-${index}`}
                            onClick={() => {
                              if (isEditing) {
                                saveEditedSlide(index);
                              } else {
                                startEditSlide(slide, index);
                              }
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-950"
                            title="Edit slide"
                          >
                            {isEditing ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Edit2 className="w-3 h-3" />}
                          </button>
                          
                          <button
                            id={`btn-copy-slide-${index}`}
                            onClick={() => handleCopySingleSlide(slide, index)}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-indigo-600"
                            title="Copy slide text"
                          >
                            {copiedSlideIndex === index ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex flex-col gap-2 mt-1">
                          <input
                            id={`edit-slide-headline-${index}`}
                            value={editedSlideHeadline}
                            onChange={(e) => setEditedSlideHeadline(e.target.value)}
                            className="text-xs font-bold text-slate-800 p-1 bg-slate-50 border border-slate-200 rounded outline-none"
                            placeholder="Slide headline"
                          />
                          <textarea
                            id={`edit-slide-body-${index}`}
                            value={editedSlideBody}
                            onChange={(e) => setEditedSlideBody(e.target.value)}
                            className="text-xs text-slate-500 p-1 bg-slate-50 border border-slate-200 rounded outline-none resize-none"
                            rows={2}
                            placeholder="Slide body copy"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              id={`btn-cancel-slide-${index}`}
                              onClick={() => setEditingSlideIndex(null)}
                              className="px-2 py-0.5 text-[10px] text-slate-500 hover:text-slate-800 border border-slate-200 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              id={`btn-save-slide-${index}`}
                              onClick={() => saveEditedSlide(index)}
                              className="px-2 py-0.5 text-[10px] bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight mb-1">
                            {slide.headline}
                          </p>
                          <p className="text-[11.5px] text-slate-500 leading-snug">
                            {slide.body}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                Generate outlines by submitting content on the left
              </div>
            )}
          </div>
        </section>

        {/* Right Column (col-span-3): Short-form Draft & Comment Hooks */}
        <section id="column-right" className="col-span-1 md:col-span-3 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Top Card: Short-form Draft */}
          <div id="card-short-form" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-[55%] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Short-form Draft</span>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    id="btn-edit-short-form"
                    onClick={() => {
                      if (isEditingShortForm) {
                        saveEditedShortForm();
                      } else {
                        setEditedShortForm(result.short_form);
                        setIsEditingShortForm(true);
                      }
                    }}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                  >
                    {isEditingShortForm ? <Check className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                    <span>{isEditingShortForm ? "SAVE" : "EDIT"}</span>
                  </button>
                  <button
                    id="btn-copy-short-form"
                    onClick={handleCopyShortForm}
                    className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-0.5"
                  >
                    {copiedShortForm ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedShortForm ? "COPIED" : "COPY"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-50 rounded-lg p-3 text-[12px] text-slate-600 leading-relaxed border border-slate-100 overflow-y-auto">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  Drafting content...
                </div>
              ) : result ? (
                isEditingShortForm ? (
                  <textarea
                    id="edit-textarea-short-form"
                    value={editedShortForm}
                    onChange={(e) => setEditedShortForm(e.target.value)}
                    className="w-full h-full bg-white border border-slate-200 rounded p-1.5 text-xs text-slate-700 outline-none resize-none focus:ring-1 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="italic whitespace-pre-wrap leading-relaxed">
                    {result.short_form}
                  </p>
                )
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-center">
                  Will appear here
                </div>
              )}
            </div>
            {result && !isEditingShortForm && (
              <span className="text-[9px] text-slate-400 mt-2 text-right shrink-0">
                {wordCount(result.short_form)} words (Ideal for organic reposting)
              </span>
            )}
          </div>

          {/* Bottom Card: Comment Hooks */}
          <div id="card-comment-hooks" className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Comment Hooks</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
              {isLoading ? (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  Crafting hooks...
                </div>
              ) : result ? (
                result.comment_hooks.map((hook, index) => {
                  const isEditing = editingCommentIndex === index;
                  return (
                    <div
                      key={index}
                      id={`comment-hook-row-${index}`}
                      className="group flex flex-col gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex justify-between items-center shrink-0">
                        <span className="text-[10px] font-bold text-slate-400">HOOK #{index + 1}</span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            id={`btn-edit-comment-${index}`}
                            onClick={() => {
                              if (isEditing) {
                                saveEditedComment(index);
                              } else {
                                startEditComment(hook, index);
                              }
                            }}
                            className="text-slate-500 hover:text-slate-900"
                          >
                            {isEditing ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Edit2 className="w-2.5 h-2.5" />}
                          </button>
                          <button
                            id={`btn-copy-comment-${index}`}
                            onClick={() => handleCopyComment(hook, index)}
                            className="text-slate-500 hover:text-indigo-600"
                          >
                            {copiedCommentIndex === index ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-2.5 h-2.5" />}
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <input
                          id={`edit-comment-input-${index}`}
                          value={editedCommentValue}
                          onChange={(e) => setEditedCommentValue(e.target.value)}
                          onBlur={() => saveEditedComment(index)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEditedComment(index)}
                          className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 outline-none focus:border-indigo-400"
                          autoFocus
                        />
                      ) : (
                        <p className="text-[11.5px] text-slate-700 leading-snug font-medium">
                          {hook}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  Waiting for generation
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer bar */}
      <footer id="main-footer" className="px-6 py-2 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
        <div className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
          PROJECT: LinkedIn Growth Agent v1.02
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Model</span>
            <span className="text-[11px] font-semibold text-slate-700">Gemini 3.5 Flash</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Latency</span>
            <span className="text-[11px] font-semibold text-slate-700">
              {latencyMs ? `${latencyMs}ms` : 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            <span>Power Mode</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
