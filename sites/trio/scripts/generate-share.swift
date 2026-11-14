import AppKit
import Foundation

// A deterministic cover built from the approved app icon; no generated imagery.
let scriptURL = URL(fileURLWithPath: #filePath)
let root = scriptURL.deletingLastPathComponent().deletingLastPathComponent()
let output = root.appendingPathComponent("public/share.png")
guard let icon = NSImage(contentsOf: root.appendingPathComponent("public/assets/trio-icon.png")) else { fatalError("Missing approved Trio icon") }
let image = NSImage(size: NSSize(width: 1200, height: 630))
image.lockFocus()
NSColor(calibratedRed: 0.063, green: 0.075, blue: 0.086, alpha: 1).setFill()
NSRect(x: 0, y: 0, width: 1200, height: 630).fill()
NSGradient(starting: NSColor(calibratedRed: 0.17, green: 0.24, blue: 0.22, alpha: 1), ending: NSColor(calibratedRed: 0.063, green: 0.075, blue: 0.086, alpha: 1))!.draw(in: NSBezierPath(ovalIn: NSRect(x: -310, y: -180, width: 1150, height: 1100)), angle: -25)
icon.draw(in: NSRect(x: 74, y: 111, width: 410, height: 410))
func text(_ value: String, x: CGFloat, y: CGFloat, size: CGFloat, weight: NSFont.Weight, color: NSColor) {
  (value as NSString).draw(at: NSPoint(x: x, y: y), withAttributes: [.font: NSFont.systemFont(ofSize: size, weight: weight), .foregroundColor: color])
}
text("Trio", x: 535, y: 397, size: 84, weight: .semibold, color: .white)
text("Seus controles.", x: 538, y: 307, size: 39, weight: .medium, color: NSColor(white: 0.91, alpha: 1))
text("Na medida certa.", x: 538, y: 253, size: 39, weight: .medium, color: NSColor(white: 0.91, alpha: 1))
text("Gratuito · Nativo para macOS", x: 540, y: 191, size: 21, weight: .regular, color: NSColor(calibratedRed: 0.64, green: 0.73, blue: 0.69, alpha: 1))
text("ALLM4", x: 81, y: 49, size: 18, weight: .semibold, color: NSColor(white: 0.7, alpha: 1))
text("allm4.com/trio", x: 940, y: 49, size: 18, weight: .regular, color: NSColor(white: 0.7, alpha: 1))
image.unlockFocus()
guard let tiff = image.tiffRepresentation, let bitmap = NSBitmapImageRep(data: tiff), let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("PNG conversion failed") }
try png.write(to: output, options: .atomic)
print(output.path)
