import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const groupsData = [
  {
    id: 1,
    name: "Desenvolvedores Front-End",
    description: "Grupo focado em tecnologias de front-end, como React, Vue e Angular.",
    participants: ["Carlos Almeida", "Ana Pereira", "José Souza"],
  },
  {
    id: 2,
    name: "Marketing Digital",
    description: "Grupo sobre estratégias de marketing digital, SEO, e Ads.",
    participants: ["Mariana Silva", "Felipe Costa", "Juliana Ramos"],
  },
  {
    id: 3,
    name: "Gestão de Projetos",
    description: "Grupo sobre gestão de projetos ágeis e tradicionais.",
    participants: ["Ricardo Lima", "Beatriz Oliveira", "Gabriel Fernandes"],
  },
];

const avatars = [
  "/images/avatar1.jpg", // Carlos Almeida
  "/images/avatar2.jpg", // Ana Pereira
  "/images/avatar3.jpg", // José Souza
  "/images/avatar4.jpg", // Mariana Silva
  "/images/avatar5.jpg", // Felipe Costa
  "/images/avatar6.jpg", // Juliana Ramos
  "/images/avatar7.jpg", // Ricardo Lima
  "/images/avatar8.jpg", // Beatriz Oliveira
  "/images/avatar9.jpg", // Gabriel Fernandes
];

export default function GruposPage() {
  const [groups] = useState(groupsData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreateGroup = () => {
    if (newGroupName) {
      alert(`Grupo "${newGroupName}" criado com sucesso!`);
      setNewGroupName(""); // Clear the input
      setShowCreateModal(false); // Close modal
    } else {
      alert("Por favor, forneça um nome para o grupo.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-semibold text-gray-900">Meus Grupos</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Criar novo grupo
        </button>
      </div>

      {/* Grupos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <h3 className="text-2xl font-semibold text-gray-800">{group.name}</h3>
            <p className="text-gray-600 mt-2">{group.description}</p>

            <div className="mt-4 flex items-center space-x-2">
              {group.participants.slice(0, 3).map((participant, i) => (
                <div key={i} className="flex items-center -ml-2">
                  <img
                    src={avatars[i % avatars.length]}
                    alt={participant}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                </div>
              ))}
              {group.participants.length > 3 && (
                <span className="text-gray-500">+{group.participants.length - 3} mais</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para criar novo grupo */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Criar Novo Grupo</h2>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder="Nome do grupo"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
