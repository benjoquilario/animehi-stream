import React from "react"

type SectionProps = {
  children: React.ReactNode
}

const Section = ({ children }: SectionProps): JSX.Element => {
  return (
    <div className="min-h-[calc(100vh_-_52px)] overflow-hidden px-0 md:min-h-[calc(100vh_-_67px)]  md:px-[3%] xl:min-h-[calc(100vh_-_84px)] 2xl:min-h-[calc(100vh_-_104px)]">
      <div className="mt-[52px] md:mt-[67px] xl:mt-[84px] 2xl:mt-[104px]">
        {children}
      </div>
    </div>
  )
}

export default React.memo(Section)
