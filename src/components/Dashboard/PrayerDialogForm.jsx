import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { DialogTitle, DialogDescription } from "../ui/dialog";

export default function PrayerDialogForm({ prayer, onChange, onSubmit, isSubmitting }) {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <DialogTitle>Add New Prayer</DialogTitle>
        <DialogDescription>
          Keep your prayer request short and sweet.
        </DialogDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label>Name</Label>
          <Input
            placeholder="Student Name"
            value={prayer.studentName}
            onChange={(e) => onChange({ ...prayer, studentName: e.target.value })}
          />
          <Label>Ministry Group</Label>
          <Input
            placeholder="Ministry (optional)"
            value={prayer.ministryGroup}
            onChange={(e) => onChange({ ...prayer, ministryGroup: e.target.value })}
          />
          <Label>Prayer Request</Label>
          <Input
            placeholder="Short Prayer Request"
            value={prayer.content}
            onChange={(e) => onChange({ ...prayer, content: e.target.value })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onSubmit} disabled={isSubmitting}>
          Create
        </Button>
      </CardFooter>
    </Card>
  );
}
