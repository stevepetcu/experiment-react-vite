import {IconProps} from './IconProps';
import './IconStyles.css';
import classNames from 'classnames';

export default function OIcon({width, height, classes}: IconProps) {
  return <div className={classNames('icon', classes)}>
    <svg fill="currentColor" strokeWidth="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
         width={`${width}px`} height={`${height}px`} style={{overflow: 'visible'}}>
      <path
        d="M464 256a208 208 0 1 0-416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0z"></path>
    </svg>
  </div>;
}
