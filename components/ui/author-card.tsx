interface AuthorCardProps {
  name: string
  bio?: string
  image?: string
}

export function AuthorCard({ name, bio, image = '/avatar.svg' }: AuthorCardProps) {
  return (
    <div className="mt-16 rounded-2xl bg-muted/20 px-6 py-8 sm:px-10 sm:py-10 border border-shadow-gray">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 mx-auto sm:mx-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full rounded-full object-cover border-2 border-shadow-gray"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center text-white font-semibold text-xl">
              {name ? name[0].toUpperCase() : 'A'}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {name || 'Author'}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {bio || "Hi everyone! I am Filipino Web Developer, but learning is endless, so I've started this blog. I love coding, food, entrepreneurship, and money 🤑. Just enjoy reading my posts, and I hope you find yourself entertained and informed by the information you find here."}
          </p>
        </div>
      </div>
    </div>
  )
}
