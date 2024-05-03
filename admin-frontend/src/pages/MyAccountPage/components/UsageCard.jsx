export default function UsageCard(props) {
  function getFirstDayOfNextMonth() {
    const today = new Date(); // Current date
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1); // Set to next month
    nextMonth.setDate(1); // Set to the first day of the month
    return nextMonth;
  }

  let firstDayOfNextMonth = getFirstDayOfNextMonth();
  const options = { year: "numeric", month: "long", day: "numeric" };
  firstDayOfNextMonth = firstDayOfNextMonth.toLocaleString("en-US", options);

  return (
    <div className="border bg-gray-50 p rounded-md my-8">
      <div className="px-5 py-4">
        <h3 className="text-xl sm:text-2xl mb-1 font-medium">Usage</h3>
        <div className="mt-4">
          <p className="mb-2">
            Messages consumed: {props.messagesSent}/{props.messagesTotal}{" "}
          </p>
          <p>
            Your credits renew at the start of every calendar month. Next
            renewal: {firstDayOfNextMonth}
          </p>
        </div>
      </div>
    </div>
  );
}
