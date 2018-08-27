/**
 * Created by Andrew on 3/19/16.
 */
class TextInput extends createjs.Container {
  constructor(placeHolder, type="text") {
    super();

    // Field Settings
    this.width = 200;
    this.height = 40;

    this.type = type;

    // Text Settings
    this.placeHolder = placeHolder;
    this.backgroundColor = '#ccc';
    this.placeHolderTextColor = '#999';
    this.textColor = '#222';
    this.fontSize = 20;
    this.cursorWidth = 2;
    this.cursorColor = '#555';

    // Private Settings
    this._hiddenInput = null;
    this._bg = null;
    this._placeHolderText = null;
    this._visiblePreCursorText = null;
    this._visiblePostCursorText = null;
    this._preCursorText = "";
    this._postCursorText = "";
    this._cursor = null;
    this._padding = 0;
    this._focused = false;
    this._selectedDuration = 0;

    if (this.constructor.focused_count === undefined) this.constructor.focused_count = 0;

    this.show();
  }

  show() {
    this._setupDomNode();
    this._setupField();
    this._setupListeners();
  }

  hide() {
    this._teardownDomNode();
    this.focused = false;
  }

  set focused(value) {
    if(this._focused === value) return;
    this._focused = value;
    if(value) {

      if (this.constructor.focused_count == 0) {
        this.constructor.old_keydown = document.onkeydown;
        document.onkeydown = null;
      }
      this.constructor.focused_count += 1;

      this._selectInput();
      this._selectedDuration = 0;
      this._cursor.visible = true;

    } else {
      this._deSelectInput;
      this._cursor.visible = false;

      this.constructor.focused_count -= 1;
      if (this.constructor.focused_count == 0) {
        document.onkeydown = this.constructor.old_keydown;
      }
    }
  }

  update() {
    this._setupField();
  }

  _getFontStyle() {
    return '20px Arial';
  }

  _setupDomNode() {
    if(this._hiddenInput === null) {
      this._hiddenInput = document.createElement('input');
    
    }
    this._hiddenInput.autocomplete = "off";
    this._hiddenInput.type = "text";
    this._hiddenInput.style.display = 'none';
    this._hiddenInput.style.position = 'absolute';
    this._hiddenInput.style.zIndex = -100;
    if(!document.body.contains(this._hiddenInput))
      document.body.appendChild(this._hiddenInput);
  }
  _teardownDomNode() {
    if(document.body.contains(this._hiddenInput))
      document.body.removeChild(this._hiddenInput);
  }

  _setupField() {
    this._setupVariables();
    this._setupBg();
    this._setupPlaceHolderText();
    this._setupVisibleText();
    this._setupCursor();
  }

  _setupVariables() {
    this._padding = this.height - this.fontSize * 1.5;
  }

  _setupBg() {
    if (this._bg === null) {
      this._bg = new createjs.Shape();
      this.addChild(this._bg);
    } else {
      this._bg.graphics.clear();
    }
    this._bg.graphics.beginFill(this.backgroundColor).drawRect(0, 0, this.width, this.height);
  }

  _setupPlaceHolderText() {
    if (this._placeHolderText === null) {
      this._placeHolderText = new createjs.Text(
        this.placeHolder,
        this._getFontStyle(),
        this.placeHolderTextColor
      );
      this._placeHolderText.y = this._placeHolderText.x = this._padding;
      this.addChild(this._placeHolderText);
    } else {
      this._placeHolderText.text = this.placeHolder;
    }
  }

  _setupVisibleText() {
    if (this._visiblePreCursorText === null) {
      this._visiblePreCursorText = new createjs.Text(
        this._preCursorText,
        this._getFontStyle(),
        this.textColor
      );
      this._visiblePreCursorText.y = this._visiblePreCursorText.x = this._padding;
      this.addChild(this._visiblePreCursorText);
    } else {
      this._visiblePreCursorText.text = this._preCursorText;
    }

    if (this._visiblePostCursorText === null) {
      this._visiblePostCursorText = new createjs.Text(
        this._postCursorText,
        this._getFontStyle(),
        this.textColor
      );
      this._visiblePostCursorText.y = this._visiblePostCursorText.x = this._padding;
    } else {
      this._visiblePostCursorText.text = this._postCursorText;
    }
  }

  _setupCursor() {
    if (this._cursor === null) {
      this._cursor = new createjs.Shape();
      this._cursor.graphics
        .beginFill(this.cursorColor)
        .drawRect(this._padding, this.fontSize * .25, this.cursorWidth, this.fontSize * 1.5);
      this._cursor.x = 0; // this will signify pure text offset
      this._cursor.visible = false;
      this.addChild(this._cursor);
    } else {

    }
  }

  handleKeyDown(event) {
    console.log(event.keyCode);
  }

  _setupListeners() {
    window.addEventListener('click', (e) => {
      var pt = this.globalToLocal(e.pageX, e.pageY);
      this._click(pt);
    });



    this.on('tick', () => this._tick);
  }

  _click(lp) {
    this.focused = this.hitTest(lp.x, lp.y);

    this._placeHolderText.visible = !this._focused && this._hiddenInput.value === "";
    if (this._focused) {
      var cursor_i = this._hiddenInput.value.length;
      for(var i = 0; i < this._hiddenInput.value.length; i++) {
        this._visiblePostCursorText.text = this._hiddenInput.value.substring(0, i);
        if (this.type == "password") this._visiblePostCursorText.text = "*".repeat(this._visiblePostCursorText.text.length);

        if(lp.x - this._padding < this._visiblePostCursorText.getMeasuredWidth()) {
          cursor_i = i;
          break;
        }
      }
      this._hiddenInput.setSelectionRange(cursor_i, cursor_i);
    }
  }

  _tick() {
    if (this._focused) {
      if (this._selectedDuration % 8 === 0) {
        this._cursor.visible = !this._cursor.visible;
      }
      this._selectedDuration++;

      

      var cursor_i = this._hiddenInput.selectionStart;
      this._postCursorText = this._hiddenInput.value.substring(0, cursor_i);
      if (this.type == "password") this._postCursorText = "*".repeat(this._postCursorText.length);
      this._cursor.x = this._visiblePostCursorText.getMeasuredWidth();

      this._preCursorText = this._hiddenInput.value;
      if (this.type == "password") this._preCursorText = "*".repeat(this._preCursorText.length);
      this.update();
    }
  }

  _selectInput() {
    if(this.stage.canvas == null) return;
    this._hiddenInput.style.display = 'block';
    this._hiddenInput.style.left = (this.x + this.stage.canvas.offsetLeft + this._padding) + 'px';
    this._hiddenInput.style.top = (this.y + this.stage.canvas.offsetTop + this._padding) + 'px';
    this._hiddenInput.focus();
  }

  _deSelectInput() {
    this._hiddenInput.style.display = 'none';
  }

  get value() {
    return this._hiddenInput.value;
  }
}