// import React, { useState } from 'react';
// import { UserRole } from '../types';
// import { GraduationCapIcon, ClipboardListIcon, ShieldCheckIcon } from '../components/Icons';
// import AuthModal from '../components/AuthModal';

// interface LoginCardProps {
//   role: UserRole;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   onSelectRole: (role: UserRole) => void;
// }

// const LoginCard: React.FC<LoginCardProps> = ({ role, title, description, icon, onSelectRole }) => (
//   <div 
//     onClick={() => onSelectRole(role)}
//     className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-transparent hover:border-blue-500"
//     role="button"
//     tabIndex={0}
//     onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectRole(role)}
//     aria-label={`Login as ${title}`}
//   >
//     <div className="mx-auto bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
//       {icon}
//     </div>
//     <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-500">{description}</p>
//   </div>
// );

// const LoginPage: React.FC = () => {
//   const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-extrabold text-blue-600">EventEase</h1>
//           <p className="text-xl text-gray-600 mt-2">Simplify Your College Events</p>
//         </div>

//         <div className="text-center mb-12 max-w-2xl">
//           <h2 className="text-3xl font-bold text-gray-800">Welcome!</h2>
//           <p className="text-lg text-gray-500 mt-2">Please sign in to manage and participate in your campus events.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
//           <LoginCard
//             role="PARTICIPANT"
//             title="Student Login"
//             description="View event details, register, and get your ticket."
//             icon={<GraduationCapIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//           <LoginCard
//             role="ORGANIZER"
//             title="Organizer Login"
//             description="Create, manage, and track your events and registrations."
//             icon={<ClipboardListIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//           <LoginCard
//             role="ADMIN"
//             title="Admin Login"
//             description="Oversee all events and manage organizer access."
//             icon={<ShieldCheckIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//         </div>

//         <div className="mt-16 text-center text-gray-500">
//           <p>Don’t have an account? Contact your organizer or administrator.</p>
//         </div>
//       </div>

//       {selectedRole && (
//         <AuthModal role={selectedRole} onClose={() => setSelectedRole(null)} />
//       )}
//     </>
//   );
// };

// export default LoginPage;
// import React, { useState } from 'react';
// import { UserRole } from '../types';
// import { GraduationCapIcon, ClipboardListIcon, ShieldCheckIcon } from '../components/Icons';
// import AuthModal from '../components/AuthModal';

// interface LoginCardProps {
//   role: UserRole;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   onSelectRole: (role: UserRole) => void;
// }

// const LoginCard: React.FC<LoginCardProps> = ({ role, title, description, icon, onSelectRole }) => (
//   <div 
//     onClick={() => onSelectRole(role)}
//     className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 border-t-4 border-transparent hover:border-blue-500"
//     role="button"
//     tabIndex={0}
//     onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectRole(role)}
//     aria-label={`Login as ${title}`}
//   >
//     <div className="mx-auto bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mb-4">
//       {icon}
//     </div>
//     <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
//     <p className="text-gray-500">{description}</p>
//   </div>
// );

// const LoginPage: React.FC = () => {
//   const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
//         <div className="text-center mb-8">
//           <h1 className="text-5xl font-extrabold text-blue-600">EventEase</h1>
//           <p className="text-xl text-gray-600 mt-2">Simplify Your College Events</p>
//         </div>

//         <div className="text-center mb-12 max-w-2xl">
//           <h2 className="text-3xl font-bold text-gray-800">Welcome!</h2>
//           <p className="text-lg text-gray-500 mt-2">Please sign in to manage and participate in your campus events.</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
//           <LoginCard
//             role="PARTICIPANT"
//             title="Student Login"
//             description="View event details, register, and get your ticket."
//             icon={<GraduationCapIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//           <LoginCard
//             role="ORGANIZER"
//             title="Organizer Login"
//             description="Create, manage, and track your events and registrations."
//             icon={<ClipboardListIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//           <LoginCard
//             role="ADMIN"
//             title="Admin Login"
//             description="Oversee all events and manage organizer access."
//             icon={<ShieldCheckIcon className="w-8 h-8 text-blue-500" />}
//             onSelectRole={setSelectedRole}
//           />
//         </div>

//         <div className="mt-16 text-center text-gray-500">
//           <p>Don’t have an account? Contact your organizer or administrator.</p>
//         </div>
//       </div>

//       {selectedRole && (
//         <AuthModal role={selectedRole} onClose={() => setSelectedRole(null)} />
//       )}
//     </>
//   );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { GraduationCapIcon, ClipboardListIcon, ShieldCheckIcon } from '../components/Icons';
import AuthModal from '../components/AuthModal';

// --- Login Card ---
interface LoginCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelectRole: (role: UserRole) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ role, title, description, icon, onSelectRole }) => (
  <motion.div
    whileHover={{ y: -10, scale: 1.05 }}
    transition={{ duration: 0.3 }}
    onClick={() => onSelectRole(role)}
    className="backdrop-blur-md bg-white/30 border border-white/40 
               rounded-xl shadow-lg p-6 text-center cursor-pointer 
               transition-all duration-300 hover:shadow-2xl"
    role="button"
    tabIndex={0}
    onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectRole(role)}
    aria-label={`Login as ${title}`}
  >
    <div className="mx-auto bg-blue-100/60 backdrop-blur-sm rounded-full h-16 w-16 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-black mb-2">{title}</h3>
    <p className="text-black/70">{description}</p>
  </motion.div>
);

// --- Login Page ---
const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <>
      {/* Background with parallax effect */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 font-sans">
        {/* Parallax shapes */}
        <motion.div
          className="absolute top-10 left-20 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex flex-col items-center p-6 w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl font-extrabold text-white drop-shadow-lg"
            >
              EventEase
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl text-gray-200 mt-2"
            >
              Simplify Your College Events
            </motion.p>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-12 max-w-2xl">
            <h2 className="text-3xl font-bold text-white">Welcome!</h2>
            <p className="text-lg text-gray-200 mt-2">
              Please sign in to manage and participate in your campus events.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
            <LoginCard
              role="PARTICIPANT"
              title="Student Login"
              description="View event details, register, and get your ticket."
              icon={<GraduationCapIcon className="w-8 h-8 text-blue-700" />}
              onSelectRole={setSelectedRole}
            />
            <LoginCard
              role="ORGANIZER"
              title="Organizer Login"
              description="Create, manage, and track your events and registrations."
              icon={<ClipboardListIcon className="w-8 h-8 text-blue-700" />}
              onSelectRole={setSelectedRole}
            />
            <LoginCard
              role="ADMIN"
              title="Admin Login"
              description="Oversee all events and manage organizer access."
              icon={<ShieldCheckIcon className="w-8 h-8 text-blue-700" />}
              onSelectRole={setSelectedRole}
            />
          </div>

          {/* Footer Note */}
          <div className="mt-16 text-center text-gray-300">
            <p>Don’t have an account? Contact your organizer or administrator.</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRole && (
        <AuthModal role={selectedRole} onClose={() => setSelectedRole(null)} />
      )}
    </>
  );
};

export default LoginPage;
