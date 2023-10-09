import React from "react"

type InfoItemProps = {
  title: string
  info: string
}

const InfoItem = ({ title, info }: InfoItemProps): JSX.Element => (
  <div className="text-gray-400">
    <p className="font-semibold">{title}</p>
    <p className="flex flex-row gap-2 whitespace-pre-line md:flex-col">
      {info}
    </p>
  </div>
)

export default InfoItem
