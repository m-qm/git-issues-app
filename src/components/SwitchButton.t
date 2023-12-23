/* Add these styles to your existing CSS file or create a new one */

.switch-container {
  display: flex;
  align-items: center;
}

.switch-label {
  font-size: 14px;
  margin: 0 10px;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.switch-label.active {
  color: #fff; /* Change the color of the active label */
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; /* Default background color of the switch */
  transition: 0.3s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #fff; /* Color of the switch knob */
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3; /* Change background color when switch is checked */
}

input:checked + .slider:before {
  transform: translateX(20px); /* Move the switch knob to the right when checked */
}
