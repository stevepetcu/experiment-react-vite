import {IconProps} from './IconProps';
import './IconStyles.css';
import classNames from 'classnames';

export default function XIcon({width, height, classes}: IconProps) {
  return <div className={classNames('icon', classes)}>
    <svg fill="currentColor" strokeWidth="0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
         width={`${width}px`} height={`${height}px`} style={{overflow: 'visible'}}>
      <path
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"></path>
    </svg>
  </div>;
}
