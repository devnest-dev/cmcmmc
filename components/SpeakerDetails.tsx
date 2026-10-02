import { DialogTitle } from "./ui/dialog";
import { Speaker } from "@/lib/speakers";

const SpeakerDetails = ({ speaker }: { speaker: Speaker }) => {
  const { name, imgUrl, role, topic, extra, session, speakerDescriptions } =
    speaker;
  return (
    <div className="space-y-5 pt-5">
      <img
        src={imgUrl}
        alt={name}
        // The height and object position are hardcoded for specific speakers to ensure the best presentation of their photos. This is a bit hacky but it allows us to use the same component for all speakers without needing custom styling for each one.
        className={`
            ${name.includes("Kia") || name.includes("Albert") || name.includes("Gretchen") ? "h-72" : "h-72"} 
            w-full object-cover 
            ${name.includes("Miko") || name.includes("Kia") ? "object-center" : "object-center"} 
            mx-auto overflow-hidden rounded-full border border-gray-100 bg-[#f8fbff] shadow-sm sm:max-w-[18rem]`}
      />

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[#56aeff]">
          {session}
        </p>
        <DialogTitle className="text-xl text-[#1a2e5a]">{name}</DialogTitle>
        <p className="text-sm text-gray-500">{role}</p>
      </div>

      <div className="rounded-xl bg-[#f8fbff] p-4 border border-gray-100">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Topic
        </p>
        <p className="text-sm text-gray-700 italic">{topic}</p>
        {extra ? <p className="mt-3 text-sm text-gray-600">{extra}</p> : null}
      </div>

      {speakerDescriptions?.length ? (
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {speakerDescriptions.map((section) => (
            <div key={section.title} className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#2aadb5]">
                {section.title}
              </h3>
              {name.includes("Gretchen") ? (
                section.descriptions.map((description) => (
                  <p key={description} className="text-sm text-gray-700 leading-loose">
                    {description}
                  </p>
                ))
              ) : (
                <ul className="space-y-2 text-sm text-gray-700 leading-relaxed list-disc list-inside">
                  {section.descriptions.map((description) => (
                    <li key={description}>{description}</li>
                  ))}
              </ul>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SpeakerDetails;
