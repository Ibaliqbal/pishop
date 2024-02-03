import Title from "@/components/Title";

const UserReport = () => {
  return (
    <div className="text-white bg-gray-600 p-4">
      <div>
        <Title size="text-3xl" text="User Report" />
        <button onClick={() => history.back()}>back</button>
      </div>
    </div>
  );
};

export default UserReport;
