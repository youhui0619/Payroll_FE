import { ZoneEditorComponent } from './zone-editor.component';

describe('ZoneEditorComponent', () => {
  let editor: ZoneEditorComponent;
  beforeEach(() => { editor = new ZoneEditorComponent(); });
  const rectangle = () => [{ x: 100, y: 100 }, { x: 20, y: 100 }, { x: 20, y: 20 }, { x: 100, y: 20 }];

  it('saves a reverse-direction rectangle and edits it without adding another zone', () => {
    editor.draft = rectangle();
    editor.name = ' Receiving ';
    editor.save();
    expect(editor.zones[0].name).toBe('Receiving');
    expect(editor.zones[0].points).toEqual(rectangle());
    editor.name = 'Dispatch';
    editor.save();
    expect(editor.zones.length).toBe(1);
    expect(editor.zones[0].name).toBe('Dispatch');
  });

  it('rejects empty names, zero-area shapes, and duplicate names', () => {
    editor.draft = rectangle();
    editor.save();
    expect(editor.zones.length).toBe(0);
    editor.name = 'Receiving';
    editor.draft = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }];
    editor.save();
    expect(editor.zones.length).toBe(0);
    editor.draft = rectangle();
    editor.save();
    editor.setTool('polygon');
    editor.name = 'RECEIVING';
    editor.draft = rectangle();
    editor.save();
    expect(editor.zones.length).toBe(1);
    expect(editor.message).toContain('unique');
  });

  it('cancels unfinished drawings without deleting saved zones', () => {
    editor.name = 'Storage';
    editor.draft = rectangle();
    editor.save();
    editor.setTool('polygon');
    editor.draft = rectangle();
    editor.cancel();
    expect(editor.draft).toEqual([]);
    expect(editor.zones.length).toBe(1);
    editor.select(editor.zones[0]);
    editor.remove(editor.zones[0]);
    expect(editor.zones.length).toBe(0);
    expect(editor.selectedId).toBeNull();
  });
});
