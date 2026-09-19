type JsonLdProps = {
  data: Array<Record<string, unknown> | Record<string, unknown>[]>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <>
      {data.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
