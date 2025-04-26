import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function PrayerCard({ prayer, userId, onPray, onUnpray }) {
  const { _id, studentName, ministryGroup, content, prayedBy = [] } = prayer;

  const hasPrayed = userId && prayedBy.includes(userId);

  return (
    <Card className="w-72 min-h-[250px] flex flex-col justify-between p-4 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">{studentName || "Unnamed Student"}</CardTitle>
        {ministryGroup && (
          <div className="text-sm text-gray-500 mt-1">{ministryGroup}</div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full">
        <p className="text-gray-700 text-sm mb-6">{content || "No prayer request provided."}</p>

        <div className="flex items-center justify-between mt-auto">
          <Button
            variant={hasPrayed ? "default" : "outline"}
            onClick={() => (hasPrayed ? onUnpray(_id) : onPray(_id))}
            className="flex gap-2"
          >
            <Heart className={`w-4 h-4 ${hasPrayed ? "fill-current text-red-500" : ""}`} />
            {hasPrayed ? "Prayed" : "Pray"}
          </Button>
          <div className="text-sm text-gray-500">
            {prayedBy.length} prayed
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
