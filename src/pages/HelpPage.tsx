// src/pages/HelpPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronRight,
  FiSearch,
  FiArrowLeft,
  FiHelpCircle,
  FiMail,
} from "react-icons/fi";
import { Navbar } from "../components/Navbar";
import { EvalMark } from "../components/icons/EvalMark";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General
  {
    category: "General",
    question: "What is the SPCT Evaluation System?",
    answer:
      "The SPCT Evaluation System is a comprehensive platform designed to streamline the process of evaluating teacher performance. It allows administrators to manage evaluation forms, assign teachers to evaluators, track evaluation periods, and generate insightful analytics to support data-driven decisions.",
  },
  {
    category: "General",
    question: "Who can use this system?",
    answer:
      "Only administrators have direct access to the system. Administrators manage the entire evaluation process including creating evaluation forms, managing teachers and departments, setting up evaluation periods, and generating evaluation links. Teachers and students do not log into the system — they receive secure evaluation links from the admin to submit their evaluations.",
  },
  {
    category: "General",
    question: "How do I navigate the system?",
    answer:
      "After logging in as an admin, you'll be taken to the Dashboard which provides an overview of key metrics. Use the navigation links in the sidebar or the Quick Actions panel on the Dashboard to access different modules including Teachers, Departments, Subjects, Evaluation Forms, Evaluation Periods, Teacher Assignments, and Analytics.",
  },

  // Account & Authentication
  {
    category: "Account & Authentication",
    question: "How do I log in to the system?",
    answer:
      "Navigate to the login page and enter your registered email address and password. If you don't have an account yet, click the 'Sign up' link to create a new account. Your account must be approved by an administrator before you can access the system.",
  },
  {
    category: "Account & Authentication",
    question: "What should I do if I forget my password?",
    answer:
      "On the login page, click the 'Forgot Password' link. Enter your registered email address and follow the instructions sent to your email to reset your password. If you don't receive the email, check your spam folder or contact your system administrator.",
  },
  {
    category: "Account & Authentication",
    question: "How do I update my profile information?",
    answer:
      "Click on your profile avatar or name in the top-right corner of the navigation bar, then select 'Settings' from the dropdown menu. From there, you can update your personal information, change your password, and manage your notification preferences.",
  },

  // Managing Teachers
  {
    category: "Managing Teachers",
    question: "How do I add a new teacher?",
    answer:
      "Navigate to the Teachers page from the Dashboard or sidebar. Click the 'Add Teacher' button and fill in the required information including full name, email, department, and specialization. Once submitted, the teacher will be added to the system and available for evaluations.",
  },
  {
    category: "Managing Teachers",
    question: "How do I edit or delete a teacher's information?",
    answer:
      "On the Teachers page, find the teacher you want to edit and click the edit (pencil) icon. Update the necessary fields and save. To delete a teacher, click the delete (trash) icon and confirm the action. Note that deleting a teacher is permanent and cannot be undone.",
  },
  {
    category: "Managing Teachers",
    question: "Can I search for specific teachers?",
    answer:
      "Yes, the Teachers page includes a search bar that allows you to search for teachers by name, email, or department. Simply type your search term and the list will filter automatically to show matching results.",
  },

  // Departments
  {
    category: "Departments",
    question: "How do I create a new department?",
    answer:
      "Go to the Departments page and click 'Add Department'. Enter the department name, code, and a brief description. You can also assign a department head if needed. Once created, the department will appear in the departments list.",
  },
  {
    category: "Departments",
    question: "How do I view department details?",
    answer:
      "On the Departments page, click on any department card or the 'View Details' button to see comprehensive information including the department's teachers, subjects, evaluation statistics, and performance metrics.",
  },
  {
    category: "Departments",
    question: "Can I edit department information?",
    answer:
      "Yes, navigate to the department's detail page and click the 'Edit' button. You can update the department name, code, description, and department head assignment. Changes are saved immediately.",
  },

  // Subjects
  {
    category: "Subjects",
    question: "How do I add subjects to the system?",
    answer:
      "Navigate to the Subjects page and click 'Add Subject'. Fill in the subject name, code, description, and assign it to the appropriate department. Subjects are used when creating assignments and evaluation forms.",
  },
  {
    category: "Subjects",
    question: "How are subjects linked to teachers?",
    answer:
      "Subjects are linked to teachers through the Assignment module. When creating an assignment, you select a subject and assign it to a teacher. This creates the relationship between teachers and the subjects they teach.",
  },

  // Evaluation Forms
  {
    category: "Evaluation Forms",
    question: "How do I create an evaluation form?",
    answer:
      "Go to Evaluation Forms and click 'Create Form'. Give your form a name and description. Then add evaluation categories (e.g., 'Teaching Skills', 'Classroom Management') and populate each category with specific questions. You can reorder questions and categories as needed.",
  },
  {
    category: "Evaluation Forms",
    question: "What types of questions can I add?",
    answer:
      "The system supports rating-scale questions (typically 1-5) for quantitative assessment. You can organize questions into categories for better structure. Each question can have a weight or point value assigned to it.",
  },
  {
    category: "Evaluation Forms",
    question: "Can I edit an existing evaluation form?",
    answer:
      "Yes, you can edit evaluation forms as long as they haven't been used in any active evaluation period. Once a form is in use, it's locked to maintain evaluation consistency. You can duplicate an existing form to create a new version with modifications.",
  },

  // Evaluation Periods
  {
    category: "Evaluation Periods",
    question: "What is an evaluation period?",
    answer:
      "An evaluation period defines a specific timeframe during which evaluations can be conducted. It has a start date, end date, and a status (Upcoming, Active, or Completed). All evaluations must be submitted within the active period.",
  },
  {
    category: "Evaluation Periods",
    question: "How do I create and manage evaluation periods?",
    answer:
      "Navigate to Evaluation Periods and click 'Add Period'. Set the name, start date, and end date. Once created, you can activate the period to allow evaluations to begin. After the period ends, it will be marked as completed automatically.",
  },
  {
    category: "Evaluation Periods",
    question: "What happens when an evaluation period ends?",
    answer:
      "When an evaluation period ends, no new evaluations can be submitted for that period. The system will calculate final scores and make them available in reports and analytics. You can still view historical data from completed periods.",
  },

  // Teacher Assignments
  {
    category: "Teacher Assignments",
    question: "How do I assign teachers to evaluators?",
    answer:
      "Go to Teacher Assignments and click 'New Assignment'. Select the evaluation period, the teacher to be evaluated, and the evaluator(s). You can assign multiple evaluators to a single teacher for comprehensive feedback.",
  },
  {
    category: "Teacher Assignments",
    question: "Can I generate evaluation links for students?",
    answer:
      "Yes, from the Teacher Assignments page, you can generate unique evaluation links that can be shared with students. These links allow students to submit their evaluations without needing to log in to the system.",
  },
  {
    category: "Teacher Assignments",
    question: "How do I track the status of assignments?",
    answer:
      "The Teacher Assignments page shows the status of each assignment including whether evaluations have been submitted, pending evaluations, and completion rates. You can filter assignments by period, teacher, or status.",
  },

  // Student Evaluation
  {
    category: "Student Evaluation",
    question: "How do students submit evaluations?",
    answer:
      "Students receive a unique evaluation link from their instructor or administrator. Clicking the link opens a secure evaluation form where students can rate their teacher across various categories. No login is required for students.",
  },
  {
    category: "Student Evaluation",
    question: "Is student evaluation anonymous?",
    answer:
      "Yes, all student evaluations are completely anonymous. The system does not track which student submitted which evaluation. This ensures honest and unbiased feedback while protecting student privacy.",
  },
  {
    category: "Student Evaluation",
    question: "What if a student's evaluation link doesn't work?",
    answer:
      "If an evaluation link is expired or invalid, contact the system administrator or the teacher to generate a new link. Links may expire after the evaluation period ends or after a single use depending on the configuration.",
  },

  // Analytics & Reports
  {
    category: "Analytics & Reports",
    question: "What analytics are available?",
    answer:
      "The Analytics dashboard provides comprehensive insights including overall evaluation scores, teacher performance trends, department comparisons, evaluation completion rates, and identification of teachers who may need improvement. Data can be viewed as charts, graphs, and tables.",
  },
  {
    category: "Analytics & Reports",
    question: "How is the evaluation score calculated?",
    answer:
      "Evaluation scores are calculated based on the average of all rating-scale responses across all categories in the evaluation form. Scores are typically presented on a scale of 1.0 to 5.0, with 5.0 being the highest. Department and overall averages are also computed.",
  },
  {
    category: "Analytics & Reports",
    question: "Can I export analytics data?",
    answer:
      "Yes, analytics data can be exported for further analysis. Look for the export options (CSV or PDF) on the Analytics page. This allows you to create reports for meetings, accreditation purposes, or administrative records.",
  },

  // Troubleshooting
  {
    category: "Troubleshooting",
    question: "The page is not loading properly. What should I do?",
    answer:
      "First, try refreshing the page. If the issue persists, clear your browser cache and cookies. Make sure you're using a supported browser (Chrome, Firefox, Edge, or Safari). If problems continue, contact your system administrator.",
  },
  {
    category: "Troubleshooting",
    question: "I'm getting an error when submitting a form. What should I do?",
    answer:
      "Check that all required fields are filled in correctly. Ensure your internet connection is stable. If the error persists, try logging out and logging back in. If the issue continues, take a screenshot of the error and contact support.",
  },
  {
    category: "Troubleshooting",
    question: "How do I report a bug or suggest a feature?",
    answer:
      "You can report bugs or suggest features by contacting your system administrator directly. Please provide as much detail as possible including steps to reproduce the issue, screenshots, and your browser/device information.",
  },
];

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(faqData.map((item) => item.category))),
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!user) {
    return <div className="min-h-screen bg-[#F4F6FA]" />;
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar showHelp={false} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] rounded-xl p-6 sm:p-8 mb-6 sm:mb-8">
          <div
            className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-25 blur-3xl"
            style={{ background: "#3D6BFF" }}
          />
          <EvalMark className="pointer-events-none absolute -right-10 -bottom-14 w-44 h-44 sm:w-56 sm:h-56 opacity-[0.06]" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-[#3D6BFF]/20 flex items-center justify-center">
                <FiHelpCircle className="h-5 w-5 text-[#6E8CFF]" />
              </div>
              <div>
                <h1
                  className="text-xl sm:text-2xl font-semibold text-[#F4F6FA] tracking-tight"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  Help Center & FAQ
                </h1>
                <p className="text-[#8E97AE] mt-0.5 text-sm sm:text-base">
                  Find answers to common questions and learn how to use the SPCT
                  Evaluation System.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8E97AE]" />
          <input
            type="text"
            placeholder="Search for questions or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#E4E8F0] rounded-xl text-sm text-[#101625] placeholder-[#8E97AE] focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] transition-all"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category ?
                  "bg-[#3D6BFF] text-white shadow-sm"
                : "bg-white text-[#5A6478] border border-[#E4E8F0] hover:border-[#3D6BFF] hover:text-[#3D6BFF]"
              }`}>
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ?
            <div className="bg-white rounded-xl border border-[#E4E8F0] p-8 text-center">
              <FiHelpCircle className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
              <h3 className="text-lg font-medium text-[#101625] mb-1">
                No results found
              </h3>
              <p className="text-sm text-[#5A6478]">
                Try adjusting your search terms or browse by category above.
              </p>
            </div>
          : filteredFAQs.map((faq) => {
              const globalIndex = faqData.indexOf(faq);
              const isExpanded = expandedItems.has(globalIndex);
              return (
                <div
                  key={globalIndex}
                  className="bg-white rounded-xl border border-[#E4E8F0] overflow-hidden transition-all hover:border-[#3D6BFF]/30">
                  <button
                    onClick={() => toggleItem(globalIndex)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#F4F6FA]/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-[#EBF0FE] flex items-center justify-center">
                        <FiHelpCircle className="h-3.5 w-3.5 text-[#3D6BFF]" />
                      </span>
                      <span className="text-sm font-medium text-[#101625] pr-4">
                        {faq.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline text-xs text-[#8E97AE] bg-[#F4F6FA] px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                      {isExpanded ?
                        <FiChevronDown className="h-4 w-4 text-[#8E97AE]" />
                      : <FiChevronRight className="h-4 w-4 text-[#8E97AE]" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-0 border-t border-[#E4E8F0]">
                      <div className="pl-9">
                        <p className="text-sm text-[#5A6478] leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          }
        </div>

        {/* Still Need Help Section */}
        <div className="mt-8 bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] rounded-xl p-6 sm:p-8">
          <div className="relative">
            <div
              className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-10 blur-3xl"
              style={{ background: "#3D6BFF" }}
            />
            <div className="relative text-center">
              <h2
                className="text-lg sm:text-xl font-semibold text-[#F4F6FA] mb-2"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                Still Need Help?
              </h2>
              <p className="text-[#8E97AE] text-sm sm:text-base mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Reach out to our support
                team and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#3D6BFF]/10 border border-[#3D6BFF]/20 rounded-lg">
                  <FiMail className="h-5 w-5 text-[#3D6BFF]" />
                  <span className="text-[#F4F6FA] text-sm font-medium">
                    alecxanderespaldon21@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
