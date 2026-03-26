import { useEffect, useState } from "react";
import React from "react";
export default function FarmerInformation({ isReport, onSelectedFarmer }) {
  // const users = [
  //   {
  //     id: 1,
  //     fullName: "John Doe",
  //     farmName: "Green Valley Farm",
  //     address: "Cotabato, Philippines",
  //     contactInformation: "09123456789",
  //   },
  //   {
  //     id: 2,
  //     fullName: "Maria Santos",
  //     farmName: "Sunrise Farm",
  //     address: "Davao, Philippines",
  //     contactInformation: "09987654321",
  //   },
  //   {
  //     id: 3,
  //     fullName: "Pedro Cruz",
  //     farmName: "Golden Harvest",
  //     address: "General Santos, Philippines",
  //     contactInformation: "09112223333",
  //   },
  // ];

  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenList, setIsModalOpenList] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const [farmers, setFarmers] = useState([]);
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    // Remove all non-numeric characters
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(numericValue);
  };

  const fetchFarmers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/getAllFarmers`);
      const result = await res.json();
      setFarmers(result);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  const activateFarmer = async (farmer_id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/activateFarmer`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ farmerId: farmer_id.toString() }),
        }
      );
      const result = await res.json();
      setUser(result);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  const deactivateFarmer = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/deactivateFarmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      setUser(null);
    } catch (error) {
      console.error("Error deactivating farmer:", error);
    }
  };
  const handleAddFarmer = async () => {
    if (!tempUser) return;

    const farmerInformation = {
      fullName: tempUser.fullName,
      farmName: tempUser.farmName,
      address: tempUser.address,
      contactInformation: tempUser.contactInformation,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addFarmer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmerInformation),
      });
      const result = await res.json();
      setUser(result);
      setIsModalOpen(false);
      onSelectedFarmer(result); 
    } catch (error) {
      console.error("Error adding farmer:", error);
    }
  };

  const handleSelectUser = async (selectedUser) => {
    // console.log("🚀 ~ handleSelectUser ~ selectedUser:", selectedUser)
    await activateFarmer(selectedUser.farmer_information_id);
    setUser(selectedUser);
    onSelectedFarmer(selectedUser); 
    setIsModalOpenList(false);
  };

  useEffect(() => {
    fetchFarmers();
    deactivateFarmer();
  }, []);

  return (
    <>
      {/* Top Right Card */}
      <div className="bg-white shadow-md rounded-2xl p-4 border w-full">
        <h2 className="text-lg font-semibold mb-2">User Info</h2>

        {user ? (
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Name:</span> {user.full_name}
            </p>
            <p>
              <span className="font-medium">Farm:</span> {user.farm_name}
            </p>
            <p>
              <span className="font-medium">Address:</span> {user.address}
            </p>
            <p>
              <span className="font-medium">Contact:</span>{" "}
              {user.contact_information}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No Farmer selected</p>
        )}

        <button
          onClick={() => {
            setIsModalOpenList(true);
          }}
          className="mt-3 w-full bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition"
        >
          Select Farmer
        </button>
        {isReport && (
          <button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="mt-3 w-full bg-blue-500 text-white py-1.5 rounded-lg hover:bg-blue-600 transition"
          >
            Add Farmer
          </button>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Edit User Info</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Farm name / Farmer"
                // value={tempUser.fullName}
                onChange={(e) =>
                  setTempUser({ ...tempUser, fullName: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />

              {/* <input
                type="text"
                placeholder="Farm Name"
                // value={tempUser.farmName}
                onChange={(e) =>
                  setTempUser({ ...tempUser, farmName: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              /> */}

              <input
                type="text"
                placeholder="Address"
                // value={tempUser.address}
                onChange={(e) =>
                  setTempUser({ ...tempUser, address: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />

              <input
                type="number"
                placeholder="Contact Information"
                // value={tempUser.contactInformation}
                onChange={(e) =>
                  setTempUser({
                    ...tempUser,
                    contactInformation: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleAddFarmer}
                className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* List MODAL */}
      {isModalOpenList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-5 w-[400px] shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Select Farmer</h2>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {farmers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-xs text-gray-500">{u.farm_name}</p>
                  <p className="text-xs text-gray-500">
                    {u.contact_information}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpenList(false)}
                className="px-4 py-1.5 border rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
