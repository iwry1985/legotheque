export function getThemeLogo(img_num: number): string {
    return `/themes_assets/logo_${img_num.toString().padStart(2, '0')}.png`;
}
