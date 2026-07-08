// src/types/analytics.ts

// Teacher Performance Trend - Updated to match actual API response
export interface TeacherPerformanceTrend {
  academic_year: string;
  avg_rating: number;
  period: string;
  semester: string;
}

// Teacher Performance Ranking
export interface TeacherPerformanceRanking {
  teacher_id: number;
  teacher_name: string;
  subject_name: string;
  avg_rating: number;
  total_submissions: number;
}

// Evaluation Criteria Breakdown
export interface EvaluationCriteriaBreakdown {
  category: string;
  avg_rating: number;
  total_responses: number;
}

// Rating Distribution
export interface RatingDistribution {
  rating: number;
  count: number;
}

// Top Performing Teachers
export interface TopPerformingTeacher {
  teacher_id: number;
  teacher_name: string;
  subject_name: string;
  avg_rating: number;
}

// Teachers Requiring Improvement
export interface TeacherRequiringImprovement {
  teacher_id: number;
  teacher_name: string;
  subject_name: string;
  avg_rating: number;
}
