import { Card, Typography, Button } from 'antd';
import { CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import styles from "./styles.module.css";

const { Text } = Typography;

interface MemberCardProps {
    name: string;
    profession: string;

}

export default function MemberCard({
                                      name,
                                      profession,
                                  }: MemberCardProps) {
    return (
        <li style={{textAlign: "center"}}>
            <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '35px',
                border: '2px solid #EF3124',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Ваш контент внутри */}
            </div>
            <Text strong>{name}</Text>
            <p className={styles.text} style={{textTransform: "uppercase"}}>{profession}</p>
        </li>
    );
}