"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/components/layout/footer";

interface StudyGroup {
  id: number;
  name: string;
  description: string;
  members: number;
  subject: string;
  createdAt: string;
}

export default function GroupsPage() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<StudyGroup[]>([
    {
      id: 1,
      name: "Calculus Study Group",
      description: "Group for studying calculus and solving complex problems",
      members: 5,
      subject: "Mathematics",
      createdAt: "2024-03-20",
    },
    {
      id: 2,
      name: "English Speaking Club",
      description:
        "Practice English conversation skills in a friendly environment",
      members: 8,
      subject: "Languages",
      createdAt: "2024-04-10",
    },
    {
      id: 3,
      name: "Physics Problem Solvers",
      description:
        "Tackling physics exercises and preparing for exams together",
      members: 6,
      subject: "Physics",
      createdAt: "2024-05-02",
    },
    {
      id: 4,
      name: "Programming Bootcamp Group",
      description:
        "Group focused on learning JavaScript and building mini projects",
      members: 10,
      subject: "Computer Science",
      createdAt: "2024-06-15",
    },
    {
      id: 5,
      name: "History Discussion Circle",
      description:
        "Share insights and discuss historical events and interpretations",
      members: 4,
      subject: "History",
      createdAt: "2024-07-05",
    },
  ]);

  const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newGroup: StudyGroup = {
      id: groups.length + 1,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      members: 1,
      subject: formData.get("subject") as string,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setGroups([...groups, newGroup]);
    setOpen(false);
  };

  return (
    <div className="py-6 md:w-3/4 lg:w-2/3 min-h-screen max-w-[1200px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-purple-500 to-zinc-900">
            GRUPOS
          </h1>
          <h2 className="text-base text-zinc-600 w-3/6">
            Participe de conversas exclusivas com seus colegas em grupos
            fechados e compartilhe ideias, dúvidas e conhecimentos com mais
            liberdade e privacidade!
          </h2>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="w-[200px] bg-purple-600 p-3 rounded-lg text-white cursor-pointer hover:-translate-y-1 transition-all duration-300">
              Criar novo grupo
            </button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateGroup}>
              <DialogHeader>
                <DialogTitle>Create Study Group</DialogTitle>
                <DialogDescription>
                  Create a new study group to collaborate with other students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2"></div>
                <div className="grid gap-2">
                  <Input label="Nome" />
                </div>
                <div className="grid gap-2">
                  <Input label="Descricao" />
                </div>
              </div>
              <DialogFooter>
                <button type="submit">Create Group</button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <button key={group.id}>
            <Card className="hover:shadow-lg hover:-translate-y-1 hover:bg-purple-50 transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{group.members} members</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Created {group.createdAt}
                  </span>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>
      <Footer />
    </div>
  );
}
