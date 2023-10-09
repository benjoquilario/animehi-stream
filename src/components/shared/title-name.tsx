import React from "react"
import classNames from "classnames"

type TitleNameProps = {
  title: string
  classNames?: string
}

const TitleName = (props: TitleNameProps): JSX.Element => {
  return (
    <h2
      className={classNames(
        "mb-2 text-base font-semibold uppercase text-white md:text-[20px]",
        props.classNames
      )}
    >
      {props.title}
    </h2>
  )
}

export default TitleName
