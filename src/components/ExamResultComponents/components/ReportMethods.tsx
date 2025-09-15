import React from 'react';
import { ArrowDown, ArrowRight, Calculator, Database, FileText, Target, Brain, Heart, Users, TrendingUp, BarChart3 } from 'lucide-react';

export const ReportMethods = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Assessment Report Generation Methods</h1>
            <p className="text-xl text-gray-600">
              Comprehensive documentation of the assessment calculation logic and report generation process
            </p>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Assessment Structure</h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Aptitude Section</p>
                    <p className="text-sm text-blue-700">45 questions across 7 categories</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-purple-900">Psychometric Section</p>
                    <p className="text-sm text-purple-700">25 questions across 5 categories</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <Target className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-red-900">Adversity Section</p>
                    <p className="text-sm text-red-700">16 questions across 4 categories</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <Heart className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">SEI Section</p>
                    <p className="text-sm text-green-700">16 questions across 4 categories</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-medium text-orange-900">Interest Section</p>
                    <p className="text-sm text-orange-700">30 questions across 6 categories</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Components</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Category-wise Scores</p>
                  <p className="text-sm text-gray-600">Individual scores for each assessment category</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Level Determination</p>
                  <p className="text-sm text-gray-600">High/Moderate/Low classification based on thresholds</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Interpretations</p>
                  <p className="text-sm text-gray-600">Detailed explanations for each category and level</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Career Mapping</p>
                  <p className="text-sm text-gray-600">RIASEC-based career recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Flow */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Data Flow</h2>
          <div className="space-y-6">
            {/* Flow Chart */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Processing Pipeline</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-blue-100 p-4 rounded-lg text-center min-w-[200px]">
                    <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-900">Raw Data Collection</p>
                    <p className="text-sm text-blue-700">exam_responses + questions_vo</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-green-100 p-4 rounded-lg text-center min-w-[200px]">
                    <FileText className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-green-900">Data Transformation</p>
                    <p className="text-sm text-green-700">Map to question types & categories</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-6 w-6 text-gray-400" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg text-center">
                    <Brain className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-purple-900">Psychometric</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg text-center">
                    <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-blue-900">Aptitude</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg text-center">
                    <Target className="h-5 w-5 text-red-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-red-900">Adversity</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg text-center">
                    <Heart className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-green-900">SEI</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg text-center">
                    <Users className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-orange-900">Interests</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowDown className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-yellow-100 p-4 rounded-lg text-center min-w-[200px]">
                    <BarChart3 className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <p className="font-medium text-yellow-900">Final Report</p>
                    <p className="text-sm text-yellow-700">JSON API Response</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        
        {/* 1. Aptitude Assessment */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">1. Aptitude Assessment Logic</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Scoring Method</h3>
              <p className="text-blue-800 mb-4">
                <strong>Binary Scoring:</strong> 1 point for correct answer, 0 for incorrect
              </p>
              <div className="bg-white p-4 rounded border">
                <code className="text-sm text-gray-800">
                  score = selectedOptionId === correctOptionId ? 1 : 0
                </code>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions (V2)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level Thresholds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Verbal Reasoning</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Numerical Ability</td>
                    <td className="px-6 py-4 text-sm text-gray-600">7</td>
                    <td className="px-6 py-4 text-sm text-gray-600">7</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Abstract Reasoning</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Speed and Accuracy</td>
                    <td className="px-6 py-4 text-sm text-gray-600">8</td>
                    <td className="px-6 py-4 text-sm text-gray-600">8</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Mechanical Reasoning</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Space Relations</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Language Usage</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">6</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥77%, Moderate: 24-76%, Low: &lt;24%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Calculation Formula</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Category Score:</p>
                  <code className="text-blue-600">sum of correct answers in category</code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Category Percentage:</p>
                  <code className="text-blue-600">(categoryScore / maxQuestions) × 100</code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Level Assignment:</p>
                  <code className="text-blue-600">
                    percentage ≥ 77 ? "High" : percentage ≥ 24 ? "Moderate" : "Low"
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Psychometric Assessment */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Brain className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">2. Psychometric Assessment Logic</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Scoring Method</h3>
              <p className="text-purple-800 mb-4">
                <strong>Likert Scale Scoring:</strong> 1-5 points based on response intensity
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Extremely Unlikely</p>
                  <p className="text-purple-600">1 point</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Unlikely</p>
                  <p className="text-purple-600">2 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Neutral</p>
                  <p className="text-purple-600">3 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Likely</p>
                  <p className="text-purple-600">4 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Extremely Likely</p>
                  <p className="text-purple-600">5 points</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level Threshold</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage Calc</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Openness</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥17.5, Low: &lt;17.5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(score / 25) × 100</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Conscientiousness</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥17.5, Low: &lt;17.5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(score / 25) × 100</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Extraversion</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥17.5, Low: &lt;17.5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(score / 25) × 100</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Agreeableness</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥17.5, Low: &lt;17.5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(score / 25) × 100</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Neuroticism</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">25</td>
                    <td className="px-6 py-4 text-sm text-gray-600">High: ≥17.5, Low: &lt;17.5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">(score / 25) × 100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Adversity Assessment */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Target className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">3. Adversity Quotient (AQ) Logic</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Scoring Method</h3>
              <p className="text-red-800 mb-4">
                <strong>Frequency/Likelihood Scale:</strong> 1-5 points based on response
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Never / Extremely Unlikely</p>
                  <p className="text-red-600">1 point</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Almost Never / Unlikely</p>
                  <p className="text-red-600">2 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Sometimes / Neutral</p>
                  <p className="text-red-600">3 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Almost Always / Likely</p>
                  <p className="text-red-600">4 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Always / Extremely Likely</p>
                  <p className="text-red-600">5 points</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Control</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Ownership</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Reach</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Endurance</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-4">AQ Score Calculation</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">Total Category Score:</p>
                    <code className="text-red-600">Control + Ownership + Reach + Endurance</code>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">AQ Score:</p>
                    <code className="text-red-600">2 × Total Category Score</code>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">AQ Levels:</p>
                    <div className="text-red-600 space-y-1">
                      <div>High: 178-200</div>
                      <div>Moderately High: 161-177</div>
                      <div>Moderate: 135-160</div>
                      <div>Moderately Low: 118-134</div>
                      <div>Low: ≤117</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SEI Assessment */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Heart className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">4. Socio-Emotional Intelligence (SEI) Logic</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Scoring Method</h3>
              <p className="text-green-800 mb-4">
                <strong>Intensity Scale:</strong> 1-5 points with normalization
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Not At All / Never</p>
                  <p className="text-green-600">1 point</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Slightly / Almost Never</p>
                  <p className="text-green-600">2 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Fairly / Sometimes</p>
                  <p className="text-green-600">3 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Moderately / Almost Always</p>
                  <p className="text-green-600">4 points</p>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <p className="font-medium">Extremely / Always</p>
                  <p className="text-green-600">5 points</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raw Max</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Self Awareness</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Self Management</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Social Awareness</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">Social Skills</td>
                      <td className="px-4 py-4 text-sm text-gray-600">4</td>
                      <td className="px-4 py-4 text-sm text-gray-600">20</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4">SEI Normalization</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">Step 1:</p>
                    <code className="text-green-600">normalizedScore = score × 2</code>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">Step 2: Apply Normalization Table</p>
                    <div className="text-green-600 space-y-1 mt-2">
                      <div>47-50 → 10</div>
                      <div>44-46 → 9</div>
                      <div>41-43 → 8</div>
                      <div>39-40 → 7</div>
                      <div>37-38 → 6</div>
                      <div>34-36 → 5</div>
                      <div>31-33 → 4</div>
                      <div>26-30 → 3</div>
                      <div>21-25 → 2</div>
                      <div>10-20 → 1</div>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <p className="font-medium text-gray-900">Level Assignment:</p>
                    <div className="text-green-600 space-y-1">
                      <div>High: ≥8</div>
                      <div>Moderate: 5-7</div>
                      <div>Low: 1-4</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Interest and Preferences */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <Users className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">5. Interest & Preferences (RIASEC) Logic</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Scoring Method</h3>
              <p className="text-orange-800 mb-4">
                <strong>Binary Agreement:</strong> 1 point for "Agree", 0 for "Disagree"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded text-center">
                  <p className="font-medium">Agree</p>
                  <p className="text-orange-600">1 point</p>
                </div>
                <div className="bg-white p-3 rounded text-center">
                  <p className="font-medium">Disagree</p>
                  <p className="text-orange-600">0 points</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">RIASEC Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Letter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Realistic</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">R</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Doers - hands-on work</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Investigative</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">I</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Thinkers - analytical work</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Artistic</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">A</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Creators - creative work</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Social</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">S</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Helpers - people-oriented work</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Enterprising</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">E</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Persuaders - leadership work</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Conventional</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">C</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">5</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Organizers - structured work</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Top 3 Calculation</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Step 1:</p>
                  <code className="text-orange-600">Sort categories by score (descending)</code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Step 2:</p>
                  <code className="text-orange-600">Take top 3 category letters</code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Result:</p>
                  <code className="text-orange-600">["R", "I", "A"] (example)</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Question Type Mapping */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Question Type Mapping Logic</h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Section to Question Type Mapping</h3>
              <p className="text-gray-700 mb-4">
                Questions are categorized based on their section and sub-section names from the database:
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub-section Examples</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category Mapping</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Aptitude</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Numerical Reasoning, Verbal Reasoning, Abstract Reasoning</td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">aptitude</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Sub-section name → category</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Behavioural</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Leadership, Teamwork, Communication</td>
                      <td className="px-6 py-4 text-sm text-purple-600 font-medium">psychometric</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Sub-section name → category</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Behavioural</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Time Management</td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">adversity</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Special case mapping</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Behavioural</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Emotional Intelligence, Social Intelligence</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">sei</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Contains "emotional" or "social"</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Behavioural</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Interest, Preference</td>
                      <td className="px-6 py-4 text-sm text-orange-600 font-medium">interests_and_preferences</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Contains "interest" or "preference"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Dynamic Category Detection</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Algorithm:</p>
                  <code className="text-yellow-600">
                    category = subSectionName.toLowerCase().replace(/[^a-z]/g, ' ').trim()
                  </code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="font-medium text-gray-900">Examples:</p>
                  <div className="text-yellow-600 space-y-1 mt-2">
                    <div>"Numerical Reasoning" → "numerical"</div>
                    <div>"Time Management" → "time management"</div>
                    <div>"Self Awareness" → "self awareness"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Career Mapping */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Career Mapping System</h2>
          
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">Rule-Based Matching</h3>
              <p className="text-indigo-800 mb-4">
                Career recommendations are generated using 20 predefined rules that match assessment results to career paths.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">RIASEC Mapping</h4>
                  <p className="text-sm text-gray-600">Top 3 interest categories determine career fit</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">DAT Reasoning</h4>
                  <p className="text-sm text-gray-600">Aptitude levels provide skill-based guidance</p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">OCEAN Analysis</h4>
                  <p className="text-sm text-gray-600">Personality traits influence work environment fit</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sample Career Rules</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Rule 1: Engineering Explorers</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Target:</strong> Biomedical Engineer, Architect, Industrial Designer, Robotics Engineer
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Requirements:</strong> High logical and spatial aptitude, problem-solving mindset, technology interest
                  </p>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900 mb-2">Rule 8: Medical Mavericks</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Target:</strong> Sports Coach, Emergency Services Manager, Fitness Trainer, Nutritionist
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Requirements:</strong> Healthcare interest, medical research aptitude, life-changing impact focus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 8. Report Generation Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Report Generation Process</h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Step-by-Step Process</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Data Collection</h4>
                    <p className="text-sm text-gray-600">Fetch user responses and question data from Supabase</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>exam_responses JOIN questions_vo JOIN sub_sections_vo JOIN sections_vo</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Question Type Classification</h4>
                    <p className="text-sm text-gray-600">Map questions to assessment types based on section/sub-section</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>determineQuestionType(sectionName, subSectionName)</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Score Calculation</h4>
                    <p className="text-sm text-gray-600">Apply type-specific scoring functions to each response</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>scoringFunction(questionData, userResponse)</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Category Aggregation</h4>
                    <p className="text-sm text-gray-600">Sum scores within each category and calculate percentages</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>categoryScore = sum(questionScores), percentage = (score/maxScore) × 100</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">5</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Level Assignment</h4>
                    <p className="text-sm text-gray-600">Classify scores into High/Moderate/Low levels</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>level = applyThresholds(score, questionType)</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">6</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Interpretation Generation</h4>
                    <p className="text-sm text-gray-600">Generate detailed explanations for each category and level</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>interpretation = getInterpretation(category, level)</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">7</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Career Mapping</h4>
                    <p className="text-sm text-gray-600">Match results to career rules and generate recommendations</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>careerMapping = matchToRules(aptitude, psychometric, interests)</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">8</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">JSON Response</h4>
                    <p className="text-sm text-gray-600">Compile all results into structured API response format</p>
                    <div className="mt-2 bg-white p-2 rounded text-xs">
                      <code>DetailedAssessmentResult JSON</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 9. Scoring Functions Detail */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Detailed Scoring Functions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Aptitude Scoring</h3>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{`function scoreAptitude(selectedOptionId, correctOptionId) {
  return selectedOptionId === correctOptionId ? 1 : 0;
}

// Level determination:
if (percentage >= 77) return 'High';
if (percentage >= 24) return 'Moderate';
return 'Low';`}</pre>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-4">Psychometric Scoring</h3>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{`function scorePsychometric(optionText) {
  const scoreMap = {
    'extremely unlikely': 1,
    'unlikely': 2,
    'neutral': 3,
    'likely': 4,
    'extremely likely': 5
  };
  return scoreMap[optionText.toLowerCase()] || 3;
}

// Level determination:
return score >= 17.5 ? 'High' : 'Low';`}</pre>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-4">Adversity Scoring</h3>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{`function scoreAdversity(optionText) {
  const scoreMap = {
    'never': 1, 'extremely unlikely': 1,
    'almost never': 2, 'unlikely': 2,
    'sometimes': 3, 'neutral': 3,
    'almost always': 4, 'likely': 4,
    'always': 5, 'extremely likely': 5
  };
  return scoreMap[optionText.toLowerCase()] || 3;
}

// AQ Score calculation:
aqScore = 2 × (control + ownership + reach + endurance)`}</pre>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4">SEI Scoring</h3>
                <div className="bg-white p-4 rounded border">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">{`function scoreSEI(optionText) {
  const scoreMap = {
    'not at all': 1, 'never': 1,
    'slightly': 2, 'almost never': 2,
    'fairly': 3, 'sometimes': 3,
    'moderately': 4, 'almost always': 4,
    'extremely': 5, 'always': 5
  };
  return scoreMap[optionText.toLowerCase()] || 3;
}

// Normalization: score × 2, then apply lookup table`}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 10. API Response Structure */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Final API Response Structure</h2>
          
          <div className="bg-gray-900 p-6 rounded-lg">
            <pre className="text-green-400 text-sm whitespace-pre-wrap overflow-x-auto">{`{
  "detailedPsychometricScore": {
    "resultInterpretation": "Combined interpretations...",
    "questionType": "psychometric",
    "displayText": "Psychometric",
    "categoryWiseScore": {
      "openness": {
        "categoryName": "openness",
        "categoryDisplayText": "Openness",
        "categoryLetter": "O",
        "categoryScore": 14,
        "categoryPercentage": 56.0,
        "categoryScoreLevel": "Low",
        "categoryInterpretation": "Detailed explanation..."
      }
      // ... other categories
    }
  },
  "aptitudeScore": { /* Similar structure */ },
  "adversityScore": {
    "aqScore": 110,
    "aqLevel": "Low",
    // ... category details
  },
  "seiScore": { /* Similar structure */ },
  "interestAndPreferenceScore": { /* Similar structure */ },
  "careerMapping": {
    "ruleName": "Rule8",
    "idealCareer": "Sports Coach, Emergency Services Manager...",
    "riasecMappingReasoning": { /* RIASEC explanations */ },
    "datMappingReasoning": { /* Aptitude explanations */ },
    "oceanMappingReasoning": { /* Personality explanations */ },
    "clubToJoin": "Medical Mavericks",
    "tagLine": "Healing Lives, Inspiring Futures!",
    "idealFor": "Students interested in healthcare..."
  }
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};