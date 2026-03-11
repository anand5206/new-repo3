/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldPlus, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCcw, 
  Lock, 
  WifiOff, 
  UserX, 
  Database, 
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Task {
  id: string;
  text: string;
  icon: React.ReactNode;
  description: string;
}

const CONTAINMENT_TASKS: Task[] = [
  { 
    id: 'c1', 
    text: 'Disconnect from Network', 
    icon: <WifiOff className="w-4 h-4" />,
    description: 'Physically unplug the ethernet cable or disable Wi-Fi to stop lateral movement.'
  },
  { 
    id: 'c2', 
    text: 'Disable User Account', 
    icon: <UserX className="w-4 h-4" />,
    description: 'Temporarily lock the compromised user account in Active Directory/IAM.'
  },
  { 
    id: 'c3', 
    text: 'Run Initial Scan', 
    icon: <Zap className="w-4 h-4" />,
    description: 'Execute local antivirus to identify and pause the malicious process.'
  },
  { 
    id: 'c4', 
    text: 'Block IOCs', 
    icon: <Lock className="w-4 h-4" />,
    description: 'Block suspicious IP addresses and domains at the firewall/proxy level.'
  },
  { 
    id: 'c5', 
    text: 'Notify Security Team', 
    icon: <ShieldAlert className="w-4 h-4" />,
    description: 'Escalate to the SOC/CIRT team for formal incident logging.'
  },
];

const RECOVERY_TASKS: Task[] = [
  { 
    id: 'r1', 
    text: 'Complete Malware Removal', 
    icon: <ShieldCheck className="w-4 h-4" />,
    description: 'Use advanced forensic tools to ensure no persistence mechanisms remain.'
  },
  { 
    id: 'r2', 
    text: 'Restore from Backup', 
    icon: <Database className="w-4 h-4" />,
    description: 'Recover encrypted or deleted files from the last known good backup.'
  },
  { 
    id: 'r3', 
    text: 'Patch & Update', 
    icon: <RefreshCcw className="w-4 h-4" />,
    description: 'Apply all pending OS and application security updates.'
  },
  { 
    id: 'r4', 
    text: 'Reset Credentials', 
    icon: <Lock className="w-4 h-4" />,
    description: 'Force a password change for the user and any service accounts used.'
  },
  { 
    id: 'r5', 
    text: 'Post-Recovery Monitoring', 
    icon: <CheckCircle2 className="w-4 h-4" />,
    description: 'Enable enhanced logging and monitor for 72 hours for re-infection.'
  },
];

const PREVENTION_TASKS: Task[] = [
  { 
    id: 'p1', 
    text: 'Phishing Awareness Training', 
    icon: <Info className="w-4 h-4" />,
    description: 'Enroll the user in targeted security awareness training.'
  },
  { 
    id: 'p2', 
    text: 'Enforce MFA', 
    icon: <Lock className="w-4 h-4" />,
    description: 'Ensure Multi-Factor Authentication is active for all entry points.'
  },
  { 
    id: 'p3', 
    text: 'Deploy EDR/XDR', 
    icon: <ShieldPlus className="w-4 h-4" />,
    description: 'Upgrade endpoint security to advanced detection and response software.'
  },
  { 
    id: 'p4', 
    text: 'Backup Validation', 
    icon: <Database className="w-4 h-4" />,
    description: 'Schedule regular automated backup integrity tests.'
  },
  { 
    id: 'p5', 
    text: 'Regular System Audits', 
    icon: <RefreshCcw className="w-4 h-4" />,
    description: 'Implement a recurring schedule for vulnerability scanning.'
  },
];

export default function App() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'containment' | 'recovery' | 'prevention'>('containment');

  const toggleTask = (id: string) => {
    const newSet = new Set(completedTasks);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCompletedTasks(newSet);
  };

  const getProgress = (tasks: Task[]) => {
    const completed = tasks.filter(t => completedTasks.has(t.id)).length;
    return (completed / tasks.length) * 100;
  };

  const totalProgress = ((completedTasks.size / (CONTAINMENT_TASKS.length + RECOVERY_TASKS.length + PREVENTION_TASKS.length)) * 100).toFixed(0);

  const renderTaskItem = (task: Task) => {
    const isDone = completedTasks.has(task.id);
    return (
      <motion.div
        layout
        key={task.id}
        onClick={() => toggleTask(task.id)}
        className={cn(
          "group flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer",
          isDone 
            ? "bg-emerald-50/50 border-emerald-200 text-emerald-900" 
            : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
        )}
      >
        <div className={cn(
          "mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
          isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 group-hover:border-slate-400"
        )}>
          {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("p-1 rounded-md", isDone ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500")}>
              {task.icon}
            </span>
            <h3 className={cn("font-medium text-sm", isDone && "line-through opacity-70")}>{task.text}</h3>
          </div>
          <p className={cn("text-xs leading-relaxed", isDone ? "text-emerald-700/70" : "text-slate-500")}>
            {task.description}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Incident Response Planner</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded uppercase tracking-wider text-[10px]">Critical</span>
                <span className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Malware Infection: Employee Workstation
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Overall Readiness</div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <span className="text-sm font-mono font-bold text-slate-700">{totalProgress}%</span>
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                IR
              </div>
              <div className="hidden lg:block">
                <div className="text-xs font-bold leading-none">Incident Intern</div>
                <div className="text-[10px] text-slate-400">Response Team A</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-1">
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('containment')}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === 'containment' 
                    ? "bg-white shadow-sm border border-slate-200 text-slate-900" 
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className={cn("w-4 h-4", activeTab === 'containment' ? "text-red-500" : "text-slate-400")} />
                  Containment
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === 'containment' ? "rotate-90" : "opacity-0")} />
              </button>
              <button 
                onClick={() => setActiveTab('recovery')}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === 'recovery' 
                    ? "bg-white shadow-sm border border-slate-200 text-slate-900" 
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className={cn("w-4 h-4", activeTab === 'recovery' ? "text-emerald-500" : "text-slate-400")} />
                  Recovery
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === 'recovery' ? "rotate-90" : "opacity-0")} />
              </button>
              <button 
                onClick={() => setActiveTab('prevention')}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === 'prevention' 
                    ? "bg-white shadow-sm border border-slate-200 text-slate-900" 
                    : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldPlus className={cn("w-4 h-4", activeTab === 'prevention' ? "text-indigo-500" : "text-slate-400")} />
                  Prevention
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === 'prevention' ? "rotate-90" : "opacity-0")} />
              </button>
            </nav>

            <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3">Incident Summary</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="text-amber-400 font-medium">Active Response</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Type</span>
                  <span>Malware/Trojan</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Assigned</span>
                  <span>Intern #42</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2">Phase Goal</div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {activeTab === 'containment' && "Prevent the malware from spreading to other systems immediately."}
                  {activeTab === 'recovery' && "Ensure the system is safe, clean, and fully restored to operational state."}
                  {activeTab === 'prevention' && "Implement structural changes to reduce the likelihood of recurrence."}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-2xl font-bold capitalize">{activeTab} Phase</h2>
                    <p className="text-slate-500 text-sm mt-1">Execute the following steps to secure the environment.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phase Progress</div>
                    <div className="text-lg font-mono font-bold text-slate-900">
                      {activeTab === 'containment' && getProgress(CONTAINMENT_TASKS).toFixed(0)}
                      {activeTab === 'recovery' && getProgress(RECOVERY_TASKS).toFixed(0)}
                      {activeTab === 'prevention' && getProgress(PREVENTION_TASKS).toFixed(0)}
                      %
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {activeTab === 'containment' && CONTAINMENT_TASKS.map(renderTaskItem)}
                  {activeTab === 'recovery' && RECOVERY_TASKS.map(renderTaskItem)}
                  {activeTab === 'prevention' && PREVENTION_TASKS.map(renderTaskItem)}
                </div>

                {/* Phase Conclusion Card */}
                <div className={cn(
                  "p-6 rounded-2xl border transition-all",
                  getProgress(activeTab === 'containment' ? CONTAINMENT_TASKS : activeTab === 'recovery' ? RECOVERY_TASKS : PREVENTION_TASKS) === 100
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-slate-100 border-slate-200 opacity-60"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      getProgress(activeTab === 'containment' ? CONTAINMENT_TASKS : activeTab === 'recovery' ? RECOVERY_TASKS : PREVENTION_TASKS) === 100
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-300 text-slate-500"
                    )}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Phase Completion</h4>
                      <p className="text-sm text-slate-600">
                        {getProgress(activeTab === 'containment' ? CONTAINMENT_TASKS : activeTab === 'recovery' ? RECOVERY_TASKS : PREVENTION_TASKS) === 100
                          ? `Great job! The ${activeTab} phase is fully executed. Proceed to the next stage.`
                          : `Complete all tasks in the ${activeTab} phase to move forward.`}
                      </p>
                    </div>
                    {getProgress(activeTab === 'containment' ? CONTAINMENT_TASKS : activeTab === 'recovery' ? RECOVERY_TASKS : PREVENTION_TASKS) === 100 && activeTab !== 'prevention' && (
                      <button 
                        onClick={() => setActiveTab(activeTab === 'containment' ? 'recovery' : 'prevention')}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                      >
                        Next Phase
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-200 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-slate-900" />
              <span className="font-bold text-sm tracking-tight">IR PROTOCOL v3.1</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This tool is designed for Incident Response Interns to follow a structured methodology during security events. Always adhere to company policy and legal requirements.
            </p>
          </div>
          <div className="md:col-span-2 flex flex-col md:flex-row gap-8 md:justify-end">
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Methodology</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>1. Stop the Spread</li>
                <li>2. Fix and Restore</li>
                <li>3. Improve Security</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Emergency Contacts</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>SOC Hotline: ext. 999</li>
                <li>Legal Dept: ext. 404</li>
                <li>IT Support: ext. 101</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-medium uppercase tracking-widest">
          <span>© 2026 Security Operations Center</span>
          <span>Confidential // Internal Use Only</span>
        </div>
      </footer>
    </div>
  );
}
