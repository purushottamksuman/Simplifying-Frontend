import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../components/ui/button';

// Import all components
import { PropertyDasboardSubsection } from '../screens/Frame/sections/PropertyDasboardSubsection/PropertyDasboardSubsection';
import { PropertyOtpSubsection } from '../screens/Frame/sections/PropertyOtpSubsection/PropertyOtpSubsection';
import { PropertyMycourseSubsection } from '../screens/Frame/sections/PropertyMycourseSubsection/PropertyMycourseSubsection';
import { PropertyStudent6Subsection } from '../screens/Frame/sections/PropertyStudent6Subsection/PropertyStudent6Subsection';
import { PropertyStudent4Subsection } from '../screens/Frame/sections/PropertyStudent4Subsection/PropertyStudent4Subsection';
import { PropertyRewardSubsection } from '../screens/Frame/sections/PropertyRewardSubsection/PropertyRewardSubsection';
import { DivSubsection } from '../screens/Frame/sections/DivSubsection/DivSubsection';
import { PropertyRaiseAndSubsection } from '../screens/Frame/sections/PropertyRaiseAndSubsection/PropertyRaiseAndSubsection';
import { PropertyStudentSubsection } from '../screens/Frame/sections/PropertyStudentSubsection/PropertyStudentSubsection';
import { PropertyStudentWrapperSubsection } from '../screens/Frame/sections/PropertyStudentWrapperSubsection/PropertyStudentWrapperSubsection';
import { PropertyCommanSubsection } from '../screens/Frame/sections/PropertyCommanSubsection/PropertyCommanSubsection';
import { DivWrapperSubsection } from '../screens/Frame/sections/DivWrapperSubsection/DivWrapperSubsection';
import { PropertyStudent1Subsection } from '../screens/Frame/sections/PropertyStudent1Subsection/PropertyStudent1Subsection';
import { PropertyStudent5Subsection } from '../screens/Frame/sections/PropertyStudent5Subsection/PropertyStudent5Subsection';
import { SectionComponentNodeSubsection } from '../screens/Frame/sections/SectionComponentNodeSubsection/SectionComponentNodeSubsection';
import { OverlapWrapperSubsection } from '../screens/Frame/sections/OverlapWrapperSubsection/OverlapWrapperSubsection';
import { PropertySubsection } from '../screens/Frame/sections/PropertySubsection/PropertySubsection';
import { PropertyReffrealSubsection } from '../screens/Frame/sections/PropertyReffrealSubsection/PropertyReffrealSubsection';
import { PropertyStudent2Subsection } from '../screens/Frame/sections/PropertyStudent2Subsection/PropertyStudent2Subsection';
import { PropertyLiveSubsection } from '../screens/Frame/sections/PropertyLiveSubsection/PropertyLiveSubsection';
import { PropertyWrapperSubsection } from '../screens/Frame/sections/PropertyWrapperSubsection/PropertyWrapperSubsection';
import { PropertyTestAndSubsection } from '../screens/Frame/sections/PropertyTestAndSubsection/PropertyTestAndSubsection';
import { PropertyStudent3Subsection } from '../screens/Frame/sections/PropertyStudent3Subsection/PropertyStudent3Subsection';
import { PropertyRaiseSubsection } from '../screens/Frame/sections/PropertyRaiseSubsection/PropertyRaiseSubsection';
import { PropertyLoginSubsection } from '../screens/Frame/sections/PropertyLoginSubsection/PropertyLoginSubsection';
import { PropertyClubAndSubsection } from '../screens/Frame/sections/PropertyClubAndSubsection/PropertyClubAndSubsection';

const componentMap: Record<string, { component: React.ComponentType; name: string; description: string }> = {
  'dashboard': {
    component: PropertyDasboardSubsection,
    name: 'Dashboard',
    description: 'Main dashboard with navigation sidebar, welcome cards, and premium features'
  },
  'otp': {
    component: PropertyOtpSubsection,
    name: 'OTP Verification',
    description: 'OTP verification form with 6-digit input and timer'
  },
  'mycourse': {
    component: PropertyMycourseSubsection,
    name: 'My Courses',
    description: 'Course listing with progress tracking and mentor information'
  },
  'student6': {
    component: PropertyStudent6Subsection,
    name: 'Student Survey (How did you hear)',
    description: 'Survey form asking how students heard about the platform'
  },
  'student4': {
    component: PropertyStudent4Subsection,
    name: 'Student Goals',
    description: 'Goal selection form for students'
  },
  'reward': {
    component: PropertyRewardSubsection,
    name: 'Badges & Rewards',
    description: 'Rewards system with points tracking and tier progression'
  },
  'div': {
    component: DivSubsection,
    name: 'Student Name Input',
    description: 'Initial student registration form with name input'
  },
  'raise-and': {
    component: PropertyRaiseAndSubsection,
    name: 'Raise a Doubt (Modal)',
    description: 'Doubt submission system with modal form'
  },
  'student': {
    component: PropertyStudentSubsection,
    name: 'Profile Settings',
    description: 'User profile management with form fields'
  },
  'student-wrapper': {
    component: PropertyStudentWrapperSubsection,
    name: 'Profile Settings (Extended)',
    description: 'Extended profile settings with additional fields'
  },
  'comman': {
    component: PropertyCommanSubsection,
    name: 'Registration Form',
    description: 'User registration with social login options'
  },
  'div-wrapper': {
    component: DivWrapperSubsection,
    name: 'Profile Settings (Alternative)',
    description: 'Alternative profile settings layout'
  },
  'student1': {
    component: PropertyStudent1Subsection,
    name: 'Education Level Selection',
    description: 'Form to select current education level'
  },
  'student5': {
    component: PropertyStudent5Subsection,
    name: 'Language Selection',
    description: 'Preferred language selection form'
  },
  'section-component-node': {
    component: SectionComponentNodeSubsection,
    name: 'Date of Birth',
    description: 'Date of birth input form'
  },
  'overlap-wrapper': {
    component: OverlapWrapperSubsection,
    name: 'Success Message',
    description: 'Success confirmation screen'
  },
  'property': {
    component: PropertySubsection,
    name: 'Leaderboard',
    description: 'Student leaderboard with rankings and points'
  },
  'reffreal': {
    component: PropertyReffrealSubsection,
    name: 'Referrals Program',
    description: 'Referral system with earnings tracking'
  },
  'student2': {
    component: PropertyStudent2Subsection,
    name: 'Career Domain Selection',
    description: 'Career domain preference selection'
  },
  'live': {
    component: PropertyLiveSubsection,
    name: 'Live Classes',
    description: 'Live classes schedule and management'
  },
  'wrapper': {
    component: PropertyWrapperSubsection,
    name: 'Certificates',
    description: 'Certificate gallery with download options'
  },
  'test-and': {
    component: PropertyTestAndSubsection,
    name: 'Test & Assessment',
    description: 'Test management and assessment tracking'
  },
  'student3': {
    component: PropertyStudent3Subsection,
    name: 'Hobbies Selection',
    description: 'Hobbies and interests selection form'
  },
  'raise': {
    component: PropertyRaiseSubsection,
    name: 'Raise a Doubt (List)',
    description: 'List view of submitted doubts and questions'
  },
  'login': {
    component: PropertyLoginSubsection,
    name: 'Login Form',
    description: 'User login form with social authentication'
  },
  'club-and': {
    component: PropertyClubAndSubsection,
    name: 'Clubs & Community',
    description: 'Community clubs discovery and joining'
  }
};

export const ComponentPage: React.FC = () => {
  const { componentName } = useParams<{ componentName: string }>();
  
  if (!componentName || !componentMap[componentName]) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Component Not Found</h1>
          <p className="text-gray-600 mb-6">The requested component does not exist.</p>
          <Link to="/">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { component: Component, name, description } = componentMap[componentName];

  return (
    // <div className="min-h-screen bg-gray-100">
    //   <div className="bg-white shadow-sm border-b">
    //     <div className="container mx-auto px-4 py-4">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center space-x-4">
    //           <Link to="/">
    //             <Button variant="outline" size="sm">
    //               <ArrowLeftIcon className="w-4 h-4 mr-2" />
    //               Back to Components
    //             </Button>
    //           </Link>
    //           <div>
    //             <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
    //             <p className="text-gray-600">{description}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
      
      <div className="w-full">
        <Component />
      </div>
    // </div>
  );
};