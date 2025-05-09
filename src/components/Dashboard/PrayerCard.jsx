import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, UserRoundMinus } from "lucide-react";
import { format } from "date-fns";


export default function PrayerCard({ prayer, userId, onTogglePray, onDelete }) {
  const { _id, studentName, ministryGroup, status, content, prayedBy = [], createdBy, createdAt } = prayer;

  const hasPrayed = userId && prayedBy.some(p => p.toString() === userId.toString());
  const isOwner = userId && createdBy && createdBy._id && createdBy._id.toString() === userId.toString();

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md min-h-[250px] flex flex-col justify-between p-4 shadow-md relative">
      <CardHeader className="relative">
        {/* Delete button */}
        {isOwner && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onDelete(_id)}
            title="Delete this prayer"
            className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-100 rounded-full hover:scale-110 transition-transform"
          >
            <UserRoundMinus className="w-5 h-5" />
          </Button>

        )}
        <CardTitle className="text-lg">{studentName || "Unnamed Student"}</CardTitle>
        {ministryGroup && (
          <div className="text-sm text-gray-500 mt-1">{ministryGroup}</div>
        )}
        {status && (
          <div className="text-sm text-blue-500">{status}</div> 
        )}
      </CardHeader>

      <CardContent className="flex flex-col justify-between h-full">
        <p className="text-gray-700 text-sm mb-6">
          {content || "No prayer request provided."}
        </p>

        <div className="flex items-center justify-between mt-auto gap-4">
          <Button
            variant={hasPrayed ? "default" : "outline"}
            onClick={() => onTogglePray(_id, hasPrayed)} 
            className="flex gap-2"
          >
            <Heart className={`w-4 h-4 ${hasPrayed ? "fill-current text-red-500" : ""}`} />
            {hasPrayed ? "Prayed" : "Pray"}
          </Button>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {prayedBy.length} prayed
          </div>
        </div>
        {createdAt && (
          <div className="text-xs text-gray-400 mt-4">
            Created at {format(new Date(createdAt), "MMM d, yyyy")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
