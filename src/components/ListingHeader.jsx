export default function ListingHeader({
  onOpenQuestions,
  onSaveAndExit,
}) {
  return (
    <header className="flex items-center justify-between px-5 md:px-10 lg:px-[52px] py-7 bg-[#fdfdfd] border-b border-neutral-200 shadow-sm">
      
      <a
        href="#"
        className="text-3xl lg:text-4xl font-bold text-black no-underline"
      >
        Listing
      </a>

      <div className="flex items-center gap-6">
        <button
          onClick={onOpenQuestions}
          className="px-6 py-2.5 text-lg md:text-xl border border-black rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer"
        >
          Questions?
        </button>

        <button
          onClick={onSaveAndExit}
          className="px-6 py-2.5 text-lg md:text-xl border border-black rounded-md hover:bg-neutral-100 bg-transparent cursor-pointer"
        >
          Save & Exit
        </button>
      </div>

    </header>
  );
}