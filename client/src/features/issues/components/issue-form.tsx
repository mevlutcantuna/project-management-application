const IssueForm = () => {
  return (
    <div>
      <div className="px-[18px]">
        <input
          className="placeholder:text-placeholder h-7 w-full border-none text-lg font-semibold outline-none"
          placeholder="Issue Title"
        />
        <textarea
          placeholder="Add description..."
          className="placeholder:text-placeholder min-h-20 w-full resize-none border-none pt-1.5 pb-3 text-base outline-none"
        />
      </div>
    </div>
  );
};

export default IssueForm;
