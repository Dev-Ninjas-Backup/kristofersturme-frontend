interface TestimonialCardProps {
  name: string;
  videoId: string;
}

const TestimonialCard = ({ name, videoId }: TestimonialCardProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full aspect-video rounded-lg overflow-hidden shadow-elegant border border-border/50">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={`${name}'s testimonial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
      <span className="text-sm font-medium text-foreground">{name}</span>
    </div>
  );
};

export default TestimonialCard;
