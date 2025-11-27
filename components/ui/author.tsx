interface AuthorProps {
  name: string
  image?: string
}

export function Author({ name, image = '/avatar.svg' }: AuthorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/70 to-primary flex items-center justify-center text-white font-semibold text-sm">
            {name ? name[0].toUpperCase() : 'A'}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-foreground">{name || 'Anonymous'}</span>
    </div>
  )
}
