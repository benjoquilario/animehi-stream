type SideContentProps = {
  classes: string
  title: string
  info?: string | number | boolean | React.ReactNode
}

const SideContent = (props: SideContentProps): JSX.Element => (
  <li className={`${props.classes}`}>
    <div className="text-base text-white">{props.title}</div>
    <div className="text-sm italic text-slate-300">{props.info}</div>
  </li>
)

export default SideContent
