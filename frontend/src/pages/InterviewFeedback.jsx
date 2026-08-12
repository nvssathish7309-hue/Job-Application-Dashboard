import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { Star, CheckCircle, ArrowLeft } from 'lucide-react';

export default function InterviewFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interviewData, setInterviewData] = useState(null);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState({
    technicalSkills: 4,
    communication: 4,
    problemSolving: 4,
    domainKnowledge: 4,
    overallRating: 4,
    recommendation: 'Hire',
    feedback: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await interviewService.getInterviewById(id);
        if (res.success && res.data) {
          setInterviewData(res.data.interview);
          if (res.data.feedback) {
            setExistingFeedback(res.data.feedback);
            setRatings(res.data.feedback);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await interviewService.submitFeedback(id, ratings);
      if (res.success) {
        navigate('/interviews');
      }
    } catch (err) {
      alert('Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/interviews')} className="p-2 rounded-xl bg-white border border-slate-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Interview Evaluation Form
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Candidate: {interviewData?.candidateId?.fullName} ({interviewData?.round})
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        
        {/* Rating Inputs */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Technical & Soft Skills Rating (1 - 5 Stars)
          </h3>

          {[
            { key: 'technicalSkills', label: 'Technical Competency' },
            { key: 'communication', label: 'Communication & Expression' },
            { key: 'problemSolving', label: 'Problem Solving & Logic' },
            { key: 'domainKnowledge', label: 'Domain Knowledge' }
          ].map(field => (
            <div key={field.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-700">{field.label}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatings({ ...ratings, [field.key]: star })}
                    className="p-1 text-amber-400 focus:outline-none"
                  >
                    <Star className={`w-5 h-5 ${star <= ratings[field.key] ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
            Hiring Recommendation
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Strong Hire', 'Hire', 'Hold', 'Reject'].map(rec => (
              <button
                key={rec}
                type="button"
                onClick={() => setRatings({ ...ratings, recommendation: rec })}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                  ratings.recommendation === rec
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {rec}
              </button>
            ))}
          </div>
        </div>

        {/* Written Notes */}
        <div>
          <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
            Detailed Interviewer Feedback *
          </label>
          <textarea
            required
            rows={4}
            value={ratings.feedback}
            onChange={(e) => setRatings({ ...ratings, feedback: e.target.value })}
            placeholder="Write key observations, strengths, and areas for growth..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Submit Evaluation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
