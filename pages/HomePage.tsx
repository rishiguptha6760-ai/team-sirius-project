// import React, { useMemo } from 'react';
// import { Event } from '../types';
// import { CalendarIcon, LocationIcon } from '../components/Icons';

// interface EventCardProps {
//   event: Event;
//   onSelect: () => void;
// }

// const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => (
//   <div 
//     className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col"
//     onClick={onSelect}
//   >
//     <img src={`https://picsum.photos/seed/${event.id}/400/200`} alt={`${event.title} banner`} className="w-full h-40 object-cover" />
//     <div className="p-6 flex flex-col flex-grow">
//       <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
//       <p className="text-gray-600 flex-grow mb-4">{event.description}</p>
//       <div className="mt-auto space-y-2 text-sm text-gray-500">
//         <div className="flex items-center">
//           <CalendarIcon className="w-4 h-4 mr-2" />
//           <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
//         </div>
//         <div className="flex items-center">
//           <LocationIcon className="w-4 h-4 mr-2" />
//           <span>{event.venue}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// interface HomePageProps {
//   events: Event[];
//   onSelectEvent: (eventId: string) => void;
// }

// const HomePage: React.FC<HomePageProps> = ({ events, onSelectEvent }) => {
//   const groupedEvents = useMemo(() => {
//     const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

//     return sortedEvents.reduce((acc, event) => {
//         const { clubName } = event;
//         if (!acc[clubName]) {
//             acc[clubName] = [];
//         }
//         acc[clubName].push(event);
//         return acc;
//     }, {} as Record<string, Event[]>);
//   }, [events]);

//   return (
//     <div>
//       <div className="text-center mb-12">
//         <h1 className="text-4xl font-extrabold text-gray-800">Upcoming Events</h1>
//         <p className="text-lg text-gray-600 mt-2">Discover the most exciting events happening on campus, organized by club.</p>
//       </div>
      
//       {Object.keys(groupedEvents).length > 0 ? (
//         <div className="space-y-16">
//           {Object.entries(groupedEvents).map(([clubName, clubEvents]) => (
//             <section key={clubName}>
//               <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-blue-500 pb-2">{clubName}</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {clubEvents.map(event => (
//                   <EventCard key={event.id} event={event} onSelect={() => onSelectEvent(event.id)} />
//                 ))}
//               </div>
//             </section>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-16">
//           <p className="text-xl text-gray-500">No upcoming events. Check back soon!</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Event } from "../types";
import { CalendarIcon, LocationIcon } from "../components/Icons";

// --- Event Card ---
interface EventCardProps {
  event: Event;
  onSelect: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className="rounded-2xl shadow-lg overflow-hidden cursor-pointer 
               backdrop-blur-md bg-white/30 border border-white/40 
               hover:shadow-2xl hover:bg-white/40 transition-all flex flex-col"
    onClick={onSelect}
  >
    <img
      src={`https://picsum.photos/seed/${event.id}/400/200`}
      alt={`${event.title} banner`}
      className="w-full h-40 object-cover"
    />
    <div className="p-6 flex flex-col flex-grow text-black">
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <p className="flex-grow mb-4 text-sm opacity-80">{event.description}</p>
      <div className="mt-auto space-y-2 text-sm opacity-70">
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2" />
          <span>
            {new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>
        <div className="flex items-center">
          <LocationIcon className="w-4 h-4 mr-2" />
          <span>{event.venue}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Home Page ---
interface HomePageProps {
  events: Event[];
  onSelectEvent: (eventId: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ events, onSelectEvent }) => {
  const groupedEvents = useMemo(() => {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return sortedEvents.reduce((acc, event) => {
      const { clubName } = event;
      if (!acc[clubName]) {
        acc[clubName] = [];
      }
      acc[clubName].push(event);
      return acc;
    }, {} as Record<string, Event[]>);
  }, [events]);

  return (
    <div className="relative">
      {/* 🔷 Internal CSS for Hexagonal Background */}
      <style>{`
        .hex-bg {
          background-color: #0f172a;
          background-image: 
            radial-gradient(circle at 0 0, #1e293b 1px, transparent 1px),
            radial-gradient(circle at 10px 10px, #1e293b 1px, transparent 1px);
          background-size: 20px 20px;
          animation: hex-move 12s linear infinite;
        }
        @keyframes hex-move {
          from { background-position: 0 0, 10px 10px; }
          to { background-position: 20px 20px, 30px 30px; }
        }
      `}</style>

      {/* ✅ Hex background applied only outside parallax */}
      <div className="hex-bg">
        {/* Parallax Hero Section */}
        <div
          className="h-[50vh] bg-fixed bg-center bg-cover relative flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://picsum.photos/1920/1080?blur=3&random=5')",
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative z-10 text-center text-white px-6">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl font-extrabold drop-shadow-lg"
            >
              Upcoming Events
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-lg md:text-xl mt-4 text-gray-200"
            >
              Discover exciting events organized by campus clubs
            </motion.p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {Object.keys(groupedEvents).length > 0 ? (
            <div className="space-y-20">
              {Object.entries(groupedEvents).map(([clubName, clubEvents], i) => (
                <motion.section
                  key={clubName}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                >
                  <h2 className="text-3xl font-bold mb-6 text-white border-b-2 border-blue-400 inline-block pb-2">
                    {clubName}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {clubEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={() => onSelectEvent(event.id)}
                      />
                    ))}
                  </div>
                </motion.section>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-white/80">
              <p className="text-xl">No upcoming events. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;