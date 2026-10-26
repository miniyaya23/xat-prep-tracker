import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, CheckSquare, PieChart as PieChartIcon, BarChart3, Upload, Download, 
  Clock, Award, BookOpen, Brain, Calculator, Compass, Sparkles, Filter, 
  Plus, Trash2, CheckCircle2, Circle, RefreshCw, Layers, ArrowUpRight, Save, FileSpreadsheet
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

// Default syllabus topics organized by section
const INITIAL_SYLLABUS = [
  // QA & DI
  { id: 'qa-1', section: 'QA-DI', category: 'Arithmetic', topic: 'Percentages, Profit & Loss, Interest', completed: false, date: '2024-11-01', priority: 'High' },
  { id: 'qa-2', section: 'QA-DI', category: 'Arithmetic', topic: 'Ratios, Proportions & Mixtures', completed: false, date: '2024-11-02', priority: 'High' },
  { id: 'qa-3', section: 'QA-DI', category: 'Arithmetic', topic: 'Time, Speed & Distance / Work', completed: false, date: '2024-11-03', priority: 'High' },
  { id: 'qa-4', section: 'QA-DI', category: 'Algebra', topic: 'Linear & Quadratic Equations', completed: false, date: '2024-11-05', priority: 'High' },
  { id: 'qa-5', section: 'QA-DI', category: 'Algebra', topic: 'Functions, Inequalities & Logs', completed: false, date: '2024-11-07', priority: 'Medium' },
  { id: 'qa-6', section: 'QA-DI', category: 'Geometry', topic: 'Triangles, Circles & Polygons', completed: false, date: '2024-11-10', priority: 'High' },
  { id: 'qa-7', section: 'QA-DI', category: 'Geometry', topic: 'Coordinate Geometry & Trigonometry', completed: false, date: '2024-11-12', priority: 'Medium' },
  { id: 'qa-8', section: 'QA-DI', category: 'Modern Math', topic: 'Permutations, Combinations & Probability', completed: false, date: '2024-11-15', priority: 'High' },
  { id: 'qa-9', section: 'QA-DI', category: 'Modern Math', topic: 'Sequences & Series (AP, GP, HP)', completed: false, date: '2024-11-18', priority: 'Medium' },
  { id: 'qa-10', section: 'QA-DI', category: 'Data Interpretation', topic: 'Tables & Complex Bar Charts', completed: false, date: '2024-11-20', priority: 'High' },
  { id: 'qa-11', section: 'QA-DI', category: 'Data Interpretation', topic: 'Line Graphs, Pie Charts & Spider Web Sets', completed: false, date: '2024-11-22', priority: 'High' },

  // Decision Making (DM)
  { id: 'dm-1', section: 'DM', category: 'Ethical Dilemmas', topic: 'Corporate Ethics & Social Responsibility Caselets', completed: false, date: '2024-11-04', priority: 'High' },
  { id: 'dm-2', section: 'DM', category: 'Ethical Dilemmas', topic: 'Individual vs Organizational Moral Dilemmas', completed: false, date: '2024-11-06', priority: 'High' },
  { id: 'dm-3', section: 'DM', category: 'Managerial & HR', topic: 'Employee Conflict & HR Policy Scenarios', completed: false, date: '2024-11-08', priority: 'High' },
  { id: 'dm-4', section: 'DM', category: 'Managerial & HR', topic: 'Business Strategy & Revenue Optimization Scenarios', completed: false, date: '2024-11-11', priority: 'High' },
  { id: 'dm-5', section: 'DM', category: 'Analytical DM', topic: 'Data-driven Decision Making Caselets', completed: false, date: '2024-11-14', priority: 'Medium' },
  { id: 'dm-6', section: 'DM', category: 'Analytical DM', topic: 'Logical Consistency & Premise Validation', completed: false, date: '2024-11-16', priority: 'Medium' },

  // VALR
  { id: 'valr-1', section: 'VALR', category: 'Reading Comprehension', topic: 'Philosophical & Abstract RC Passages', completed: false, date: '2024-11-01', priority: 'High' },
  { id: 'valr-2', section: 'VALR', category: 'Reading Comprehension', topic: 'Economic, Business & Psychological RCs', completed: false, date: '2024-11-03', priority: 'High' },
  { id: 'valr-3', section: 'VALR', category: 'Poem Passages', topic: 'Poetry Interpretation & Tone Analysis', completed: false, date: '2024-11-09', priority: 'High' },
  { id: 'valr-4', section: 'VALR', category: 'Critical Reasoning', topic: 'Strengthening/Weakening Arguments & Assumptions', completed: false, date: '2024-11-13', priority: 'High' },
  { id: 'valr-5', section: 'VALR', category: 'Critical Reasoning', topic: 'Inference, Parallel Reasoning & Boldface Statements', completed: false, date: '2024-11-17', priority: 'Medium' },
  { id: 'valr-6', section: 'VALR', category: 'Verbal Ability', topic: 'Para Jumbles & Paragraph Completion', completed: false, date: '2024-11-19', priority: 'Medium' },
  { id: 'valr-7', section: 'VALR', category: 'Verbal Ability', topic: 'Vocabulary in Context & Advanced Grammar Usage', completed: false, date: '2024-11-21', priority: 'Medium' },

  // General Knowledge (GK)
  { id: 'gk-1', section: 'GK', category: 'Static GK', topic: 'History, Geography & Indian Constitution', completed: false, date: '2024-11-02', priority: 'Low' },
  { id: 'gk-2', section: 'GK', category: 'Business & Economy', topic: 'Major Mergers, Acquisitions & CEO/Company Heads', completed: false, date: '2024-11-08', priority: 'High' },
  { id: 'gk-3', section: 'GK', category: 'Business & Economy', topic: 'Economic Policies, RBI Rates & Budget Highlights', completed: false, date: '2024-11-15', priority: 'High' },
  { id: 'gk-4', section: 'GK', category: 'Current Affairs', topic: 'National & International Events (Last 12 Months)', completed: false, date: '2024-11-20', priority: 'High' },
  { id: 'gk-5', section: 'GK', category: 'Awards & Sports', topic: 'Nobel Prizes, Oscars, Grand Slams & Major Sports', completed: false, date: '2024-11-23', priority: 'Medium' }
];

// Color palette for charts & visual feedback
const SECTION_COLORS = {
  'QA-DI': '#3B82F6', // Blue
  'DM': '#8B5CF6',    // Purple
  'VALR': '#EC4899',  // Pink
  'GK': '#10B981'     // Emerald
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('xat_prep_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SYLLABUS;
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | planner | syllabus | data
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });
  const [statusFilter, setStatusFilter] = useState('All'); // All | Completed | Pending
  const [examDate, setExamDate] = useState(() => {
    return localStorage.getItem('xat_exam_date') || '2025-01-05';
  });

  // New task form state
  const [newTask, setNewTask] = useState({
    topic: '',
    section: 'QA-DI',
    category: 'Practice',
    date: selectedDate,
    priority: 'Medium'
  });

  // Paste CSV modal / text state
  const [pastedCSV, setPastedCSV] = useState('');
  const [importStatus, setImportStatus] = useState('');

  // Persist tasks to localStorage
  useEffect(() => {
    localStorage.setItem('xat_prep_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Persist exam date
  useEffect(() => {
    localStorage.setItem('xat_exam_date', examDate);
  }, [examDate]);

  // Countdown Calculation
  const daysLeft = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(examDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, [examDate]);

  // Calculations for Metrics & Dashboard
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const sections = ['QA-DI', 'DM', 'VALR', 'GK'];
    const sectionStats = {};

    sections.forEach(sec => {
      const secTasks = tasks.filter(t => t.section === sec);
      const secTotal = secTasks.length;
      const secDone = secTasks.filter(t => t.completed).length;
      sectionStats[sec] = {
        total: secTotal,
        completed: secDone,
        percentage: secTotal > 0 ? Math.round((secDone / secTotal) * 100) : 0
      };
    });

    return { total, completed, pending, percentage, sectionStats };
  }, [tasks]);

  // Chart Data: Sectional Completion Donut
  const pieChartData = useMemo(() => {
    const sections = ['QA-DI', 'DM', 'VALR', 'GK'];
    return sections.map(sec => ({
      name: sec,
      completed: stats.sectionStats[sec]?.completed || 0,
      total: stats.sectionStats[sec]?.total || 0,
      pending: (stats.sectionStats[sec]?.total || 0) - (stats.sectionStats[sec]?.completed || 0)
    }));
  }, [stats]);

  // Chart Data: Daily Velocity (Completed tasks grouped by date)
  const dailyVelocityData = useMemo(() => {
    const dateMap = {};
    
    // Sort all unique dates
    tasks.forEach(t => {
      if (t.date) {
        if (!dateMap[t.date]) {
          dateMap[t.date] = { date: t.date, completed: 0, total: 0 };
        }
        dateMap[t.date].total += 1;
        if (t.completed) dateMap[t.date].completed += 1;
      }
    });

    return Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tasks]);

  // Handlers
  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.topic.trim()) return;

    const item = {
      id: `custom-${Date.now()}`,
      section: newTask.section,
      category: newTask.category || 'Custom Task',
      topic: newTask.topic,
      completed: false,
      date: newTask.date || selectedDate,
      priority: newTask.priority || 'Medium'
    };

    setTasks(prev => [item, ...prev]);
    setNewTask({ topic: '', section: newTask.section, category: 'Practice', date: selectedDate, priority: 'Medium' });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const resetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all completion checkboxes? Your task list will remain.")) {
      setTasks(prev => prev.map(t => ({ ...t, completed: false })));
    }
  };

  const loadDefaultSyllabus = () => {
    if (window.confirm("Replace current schedule with the default XAT Syllabus template? Custom tasks will be removed.")) {
      setTasks(INITIAL_SYLLABUS);
    }
  };

  // CSV Export & Import Logic
  const handleExportCSV = () => {
    const headers = ['id', 'section', 'category', 'topic', 'completed', 'date', 'priority'];
    const rows = tasks.map(t => [
      t.id,
      `"${(t.section || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.topic || '').replace(/"/g, '""')}"`,
      t.completed,
      t.date || '',
      t.priority || 'Medium'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `XAT_Prep_Schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSVText = () => {
    if (!pastedCSV.trim()) {
      setImportStatus('Please paste CSV text or data first.');
      return;
    }

    try {
      const lines = pastedCSV.trim().split('\n');
      const importedTasks = [];

      // Detect header index
      let startIdx = 0;
      if (lines[0].toLowerCase().includes('section') || lines[0].toLowerCase().includes('topic')) {
        startIdx = 1;
      }

      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by comma ignoring commas inside quotes
        const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());

        if (cleanCols.length >= 2) {
          importedTasks.push({
            id: `imp-${Date.now()}-${i}`,
            section: cleanCols[1] || cleanCols[0] || 'QA-DI',
            category: cleanCols[2] || 'Imported',
            topic: cleanCols[3] || cleanCols[1] || cleanCols[0],
            completed: cleanCols[4] === 'true' || cleanCols[4] === 'TRUE' || cleanCols[4] === '1',
            date: cleanCols[5] || selectedDate,
            priority: cleanCols[6] || 'Medium'
          });
        }
      }

      if (importedTasks.length > 0) {
        setTasks(importedTasks);
        setImportStatus(`Successfully imported ${importedTasks.length} tasks!`);
        setPastedCSV('');
      } else {
        setImportStatus('Could not parse valid schedule rows. Ensure comma-separated format.');
      }
    } catch (err) {
      setImportStatus('Error parsing CSV format. Please check structure.');
    }
  };

  // Filtered Tasks for Syllabus Tab
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSection = selectedSection === 'All' || t.section === selectedSection;
      const matchesStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'Completed' ? t.completed : !t.completed;
      return matchesSection && matchesStatus;
    });
  }, [tasks, selectedSection, statusFilter]);

  // Tasks for Planner Tab selected Date
  const dateSpecificTasks = useMemo(() => {
    return tasks.filter(t => t.date === selectedDate);
  }, [tasks, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased pb-12">
      {/* Header Banner */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-30 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-md text-white">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                XAT Prep Master & Planner
              </h1>
              <p className="text-xs text-slate-400">Target XLRI & Top B-Schools Strategy Dashboard</p>
            </div>
          </div>

          {/* Exam Countdown Badge */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700/80">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            <div className="text-right">
              <div className="text-xs text-slate-400">XAT Target Date</div>
              <div className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <span>{daysLeft} Days Remaining</span>
                <input 
                  type="date" 
                  value={examDate} 
                  onChange={(e) => setExamDate(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <nav className="flex space-x-2 border-b border-slate-700/60 overflow-x-auto no-scrollbar">
            {[
              { id: 'dashboard', label: 'Dashboard & Analytics', icon: BarChart3 },
              { id: 'planner', label: 'Daily Date Planner', icon: Calendar },
              { id: 'syllabus', label: 'Sectional Syllabus', icon: CheckSquare },
              { id: 'data', label: 'Excel/CSV Sync', icon: FileSpreadsheet }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'border-blue-500 text-blue-400 bg-slate-800/60 rounded-t-lg' 
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ==================== TAB 1: DASHBOARD & ANALYTICS ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl shadow-md">
                <div className="flex justify-between items-center text-slate-400 text-xs mb-1">
                  <span>Overall Prep</span>
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">{stats.percentage}%</div>
                <div className="w-full bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }}></div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">{stats.completed} of {stats.total} topics finished</p>
              </div>

              {/* Section Quick Summary Cards */}
              {[
                { name: 'QA & DI', key: 'QA-DI', color: 'text-blue-400', bg: 'from-blue-500/10' },
                { name: 'Decision Making', key: 'DM', color: 'text-purple-400', bg: 'from-purple-500/10' },
                { name: 'VALR', key: 'VALR', color: 'text-pink-400', bg: 'from-pink-500/10' },
                { name: 'General Knowledge', key: 'GK', color: 'text-emerald-400', bg: 'from-emerald-500/10' }
              ].map(sec => {
                const secData = stats.sectionStats[sec.key];
                return (
                  <div key={sec.key} className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl shadow-md relative overflow-hidden">
                    <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                      <span className="font-medium text-slate-300">{sec.name}</span>
                      <span className={`font-semibold ${sec.color}`}>{secData.percentage}%</span>
                    </div>
                    <div className="text-xl font-bold text-slate-100">{secData.completed} / {secData.total}</div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${secData.percentage}%`, 
                          backgroundColor: SECTION_COLORS[sec.key] 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pie Chart: Sectional Completion */}
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-indigo-400" />
                      Sectional Completion Breakdown
                    </h2>
                    <p className="text-xs text-slate-400">Completed vs Pending topics per section</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieChartData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis type="number" stroke="#94a3b8" />
                      <YAxis dataKey="name" type="category" stroke="#94a3b8" width={60} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="completed" name="Completed Topics" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="pending" name="Pending Topics" fill="#475569" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Prep Velocity Trend */}
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Study Velocity & Schedule Distribution
                    </h2>
                    <p className="text-xs text-slate-400">Total planned vs completed tasks by target date</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  {dailyVelocityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyVelocityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDone" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey="total" name="Total Planned" stroke="#6366f1" fillOpacity={1} fill="url(#colorTotal)" />
                        <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" fillOpacity={1} fill="url(#colorDone)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                      No schedule dates assigned to tasks yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-blue-900/50 via-indigo-900/30 to-purple-900/50 border border-blue-800/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Ready to test your readiness?
                </h3>
                <p className="text-sm text-slate-300 mt-1">
                  Keep updating your daily progress in the Date Planner to maintain a steady prep momentum.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('planner')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium text-sm transition-all shadow-md flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Go to Daily Planner
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: DAILY DATE PLANNER ==================== */}
        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Date Selector & Quick Add Task */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Date Control Card */}
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  Select Target Date
                </h2>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-slate-100 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                
                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>Tasks for {selectedDate}:</span>
                  <span className="font-semibold text-blue-400">{dateSpecificTasks.length} Scheduled</span>
                </div>
              </div>

              {/* Add Custom Daily Task Form */}
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg">
                <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2 mb-3">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Add Study Task for {selectedDate}
                </h2>

                <form onSubmit={handleAddTask} className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Task / Topic Description</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Solve 3 Decision Making Caselets"
                      value={newTask.topic}
                      onChange={(e) => setNewTask({ ...newTask, topic: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Section</label>
                      <select 
                        value={newTask.section}
                        onChange={(e) => setNewTask({ ...newTask, section: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="QA-DI">QA & DI</option>
                        <option value="DM">Decision Making</option>
                        <option value="VALR">VALR</option>
                        <option value="GK">General Knowledge</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Priority</label>
                      <select 
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <Plus className="w-4 h-4" /> Add to Schedule
                  </button>
                </form>
              </div>

            </div>

            {/* Right Column: Date Specific Checklist */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-800/90 border border-slate-700 p-5 rounded-2xl shadow-lg min-h-[420px]">
                <div className="flex flex-wrap justify-between items-center pb-4 border-b border-slate-700 gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-indigo-400" />
                      Checklist for {selectedDate}
                    </h2>
                    <p className="text-xs text-slate-400">Tick off finished items for this date</p>
                  </div>

                  <div className="text-xs text-slate-400">
                    {dateSpecificTasks.filter(t => t.completed).length} / {dateSpecificTasks.length} Completed
                  </div>
                </div>

                {/* Tasks List for Date */}
                <div className="mt-4 space-y-3">
                  {dateSpecificTasks.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
                      <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm font-medium">No study tasks scheduled for {selectedDate}</p>
                      <p className="text-xs text-slate-500 mt-1">Add a custom task on the left or select another date from syllabus.</p>
                    </div>
                  ) : (
                    dateSpecificTasks.map((task) => (
                      <div 
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          task.completed 
                            ? 'bg-slate-900/50 border-emerald-500/30 text-slate-400' 
                            : 'bg-slate-800 border-slate-700 text-slate-100 shadow-sm hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button 
                            onClick={() => toggleTask(task.id)}
                            className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500" />
                            )}
                          </button>

                          <div className="truncate">
                            <span className={`text-sm font-medium block truncate ${task.completed ? 'line-through text-slate-500' : ''}`}>
                              {task.topic}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700 text-slate-300">
                                {task.section}
                              </span>
                              <span>{task.category}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            task.priority === 'High' ? 'border-red-500/40 text-red-400 bg-red-500/10' :
                            task.priority === 'Medium' ? 'border-amber-500/40 text-amber-400 bg-amber-500/10' :
                            'border-slate-600 text-slate-400'
                          }`}>
                            {task.priority}
                          </span>

                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-700/50 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: SECTIONAL SYLLABUS ==================== */}
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
                  <Filter className="w-3.5 h-3.5" /> Section:
                </span>
                {['All', 'QA-DI', 'DM', 'VALR', 'GK'].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSection === sec 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">Status: All</option>
                  <option value="Completed">Status: Completed</option>
                  <option value="Pending">Status: Pending</option>
                </select>

                <button
                  onClick={resetAllProgress}
                  className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-2 py-1"
                  title="Reset status checkboxes"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Checkboxes
                </button>
              </div>
            </div>

            {/* Syllabus Table / Cards */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3.5 px-4 w-12 text-center">Status</th>
                      <th className="py-3.5 px-4">Topic / Task</th>
                      <th className="py-3.5 px-4">Section</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Target Date</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-8 text-slate-500">
                          No topics found matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className="focus:outline-none"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 inline" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 inline hover:text-slate-400" />
                              )}
                            </button>
                          </td>
                          <td className={`py-3 px-4 font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                            {task.topic}
                          </td>
                          <td className="py-3 px-4">
                            <span 
                              className="text-[11px] font-semibold px-2 py-0.5 rounded text-white"
                              style={{ backgroundColor: SECTION_COLORS[task.section] || '#475569' }}
                            >
                              {task.section}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-400">
                            {task.category}
                          </td>
                          <td className="py-3 px-4 text-xs">
                            <input 
                              type="date" 
                              value={task.date || ''}
                              onChange={(e) => {
                                const newDate = e.target.value;
                                setTasks(prev => prev.map(t => t.id === task.id ? { ...t, date: newDate } : t));
                              }}
                              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs px-2 py-1 rounded focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              task.priority === 'High' ? 'text-red-400 bg-red-500/10 border border-red-500/30' :
                              task.priority === 'Medium' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30' :
                              'text-slate-400 bg-slate-700/50'
                            }`}>
                              {task.priority}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: EXCEL / CSV DATA SYNC ==================== */}
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Import / Paste CSV */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-lg space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Import / Replace Schedule via CSV
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Paste rows copied directly from Excel/Google Sheets, or paste CSV text format.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CSV Data String (Format: id, Section, Category, Topic, Completed, Date, Priority)
                </label>
                <textarea 
                  rows={8}
                  value={pastedCSV}
                  onChange={(e) => setPastedCSV(e.target.value)}
                  placeholder={`id,section,category,topic,completed,date,priority\n1,QA-DI,Arithmetic,Percentages,false,2024-11-01,High\n2,DM,Ethical Dilemmas,Corporate Ethics,false,2024-11-02,High`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {importStatus && (
                <div className={`p-3 rounded-lg text-xs font-medium ${
                  importStatus.includes('Successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {importStatus}
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={handleImportCSVText}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Parse & Load Schedule
                </button>
              </div>
            </div>

            {/* Export & Reset Controls */}
            <div className="bg-slate-800/90 border border-slate-700 p-6 rounded-2xl shadow-lg space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <Download className="w-5 h-5 text-emerald-400" />
                    Export Backup & Progress
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Download your entire current schedule, custom dates, and completion status into a CSV file to open in Excel.
                  </p>
                </div>

                <button 
                  onClick={handleExportCSV}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" /> Export Schedule to Excel/CSV
                </button>
              </div>

              <div className="border-t border-slate-700 pt-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Template Controls</h3>
                
                <button 
                  onClick={loadDefaultSyllabus}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-2.5 rounded-xl font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reload Default XAT Master Syllabus Template
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}