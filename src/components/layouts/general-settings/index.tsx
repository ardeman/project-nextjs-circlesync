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

export const GeneralSettingsPage = () => {
  return (
    <div className="grid gap-6">
      <Card x-chunk="dashboard-04-chunk-1">
        <CardHeader>
          <CardTitle>Display name</CardTitle>
          <CardDescription>
            Used to display your name instead of your email address.
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
