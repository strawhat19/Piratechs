import Avatar from './avatar';
import ElementReveal from '../../effects/element-reveal';

export default function AvatarAnimation({
    size = 150,
    className = `avatarAnimationComponent`,
}: any) {
    return <>
        <ElementReveal as={`div`} className={`${className} avatarAnimationContainer ceoHeadshotContainer`}>
            <Avatar size={size}>
                <figure className={`ceaHeadshotWrapper`}>
                    <div className={`ceaHeadshotWrapperOverlay`} />
                    <img className={`ceaHeadshot`} style={{ maxWidth: size, maxHeight: size }} alt={`Rakib`} src={`/assets/teams/developers/rakib/Rakib_Headshot.jpeg`} />
                </figure>
            </Avatar>
        </ElementReveal>
    </>
}