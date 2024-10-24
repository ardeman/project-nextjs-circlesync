import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui'

const getRandomContent = () => {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
  ]
  const sentenceLength = Math.floor(Math.random() * 20) + 5 // Random sentence length between 5 and 25 words
  const content = Array.from({ length: sentenceLength })
    .fill('')
    .map(() => words[Math.floor(Math.random() * words.length)])
    .join(' ')
  return content.charAt(0).toUpperCase() + content.slice(1) + '.'
}

export const NotesPage = () => {
  const notes = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    title: `Note ${i + 1}`,
    content: getRandomContent(),
  }))
  return (
    <main className="bg-muted/40 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="columns-1 space-y-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="break-inside-avoid"
          >
            <CardHeader>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{note.content}</p>
            </CardContent>
            <CardFooter>
              <CardDescription>Edited Mmm DD, YYYY</CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  )
}
