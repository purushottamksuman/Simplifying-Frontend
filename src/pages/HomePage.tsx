import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const components = [
  {
    name: 'Dashboard',
    id: 'dashboard',
    description: 'Main dashboard with navigation sidebar, welcome cards, and premium features',
    category: 'Dashboard',
    image: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'OTP Verification',
    id: 'otp',
    description: 'OTP verification form with 6-digit input and timer',
    category: 'Authentication',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'My Courses',
    id: 'mycourse',
    description: 'Course listing with progress tracking and mentor information',
    category: 'Education',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Student Survey (How did you hear)',
    id: 'student6',
    description: 'Survey form asking how students heard about the platform',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Student Goals',
    id: 'student4',
    description: 'Goal selection form for students',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Badges & Rewards',
    id: 'reward',
    description: 'Rewards system with points tracking and tier progression',
    category: 'Gamification',
    image: 'https://images.pexels.com/photos/1068523/pexels-photo-1068523.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Student Name Input',
    id: 'div',
    description: 'Initial student registration form with name input',
    category: 'Registration',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Raise a Doubt (Modal)',
    id: 'raise-and',
    description: 'Doubt submission system with modal form',
    category: 'Support',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Profile Settings',
    id: 'student',
    description: 'User profile management with form fields',
    category: 'Profile',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Profile Settings (Extended)',
    id: 'student-wrapper',
    description: 'Extended profile settings with additional fields',
    category: 'Profile',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Registration Form',
    id: 'comman',
    description: 'User registration with social login options',
    category: 'Authentication',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Profile Settings (Alternative)',
    id: 'div-wrapper',
    description: 'Alternative profile settings layout',
    category: 'Profile',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Education Level Selection',
    id: 'student1',
    description: 'Form to select current education level',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Language Selection',
    id: 'student5',
    description: 'Preferred language selection form',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Date of Birth',
    id: 'section-component-node',
    description: 'Date of birth input form',
    category: 'Registration',
    image: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Success Message',
    id: 'overlap-wrapper',
    description: 'Success confirmation screen',
    category: 'Feedback',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Leaderboard',
    id: 'property',
    description: 'Student leaderboard with rankings and points',
    category: 'Gamification',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Referrals Program',
    id: 'reffreal',
    description: 'Referral system with earnings tracking',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Career Domain Selection',
    id: 'student2',
    description: 'Career domain preference selection',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Live Classes',
    id: 'live',
    description: 'Live classes schedule and management',
    category: 'Education',
    image: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Certificates',
    id: 'wrapper',
    description: 'Certificate gallery with download options',
    category: 'Achievements',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Test & Assessment',
    id: 'test-and',
    description: 'Test management and assessment tracking',
    category: 'Education',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Hobbies Selection',
    id: 'student3',
    description: 'Hobbies and interests selection form',
    category: 'Survey',
    image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Raise a Doubt (List)',
    id: 'raise',
    description: 'List view of submitted doubts and questions',
    category: 'Support',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Login Form',
    id: 'login',
    description: 'User login form with social authentication',
    category: 'Authentication',
    image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  },
  {
    name: 'Clubs & Community',
    id: 'club-and',
    description: 'Community clubs discovery and joining',
    category: 'Community',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
  }
];

const categories = ['All', 'Dashboard', 'Authentication', 'Education', 'Survey', 'Profile', 'Gamification', 'Support', 'Community', 'Marketing', 'Achievements', 'Registration', 'Feedback'];

export const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredComponents = components.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Educational Platform Components
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of UI components designed for educational platforms. 
            Each component showcases different aspects of student engagement, learning management, and user interaction.
            <br /><br />
            <a href="/admin/exam-management" className="text-blue-600 hover:text-blue-800 underline font-medium">
              🔧 Admin Exam Management System
            </a>
          </p>
        </header>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredComponents.length} component{filteredComponents.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredComponents.map(component => (
            <Card key={component.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={component.image}
                    alt={component.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {component.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {component.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {component.description}
                  </p>
                  <Link to={`/component/${component.id}`}>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" size="sm">
                      View Component
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No components found matching your criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-blue-500 hover:text-blue-600 underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};