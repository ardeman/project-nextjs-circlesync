import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'

export const AppearanceSettingsPage = () => {
  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Theme preferences</CardTitle>
          <CardDescription>
            Customize the appearance of the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Input placeholder="Store Name" />
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
