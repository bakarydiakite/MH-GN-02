import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { birthService } from '../../services/birth.service';

type ChildCardProps = {
  name: string;
  birthDate: string;
  location: string;
  id: string;
  photoUri: string;
  onPress: () => void;
};

const ChildCard = ({ name, birthDate, location, id, photoUri, onPress }: ChildCardProps) => (
  <View style={styles.childCard}>
    <View style={styles.childPhotoWrapper}>
      <Image source={{ uri: photoUri }} style={styles.childPhoto} resizeMode="cover" />
      <View style={styles.certifiedBadge}>
        <Text style={styles.certifiedText}>CERTIFIÉ</Text>
      </View>
    </View>
    <View style={styles.childBody}>
      <View style={styles.childInfoRow}>
        <Text style={styles.childName}>{name}</Text>
      </View>
      <Text style={styles.childBirthDate}>{birthDate}</Text>

      <View style={styles.childMeta}>
        <View style={styles.childMetaItem}>
          <MaterialIcons name="location-on" size={14} color={Colors.primary} />
          <Text style={styles.childMetaText}>{location}</Text>
        </View>
        <View style={styles.childMetaItem}>
          <MaterialIcons name="fingerprint" size={14} color={Colors.primary} />
          <Text style={styles.childMetaText}>ID: {id}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewActeBtn} onPress={onPress}>
        <MaterialIcons name="description" size={18} color="#ffffff" />
        <Text style={styles.viewActeBtnText}>Voir l&apos;acte</Text>
      </TouchableOpacity>
    </View>
  </View>
);

/**
 * MesEnfantsScreen
 * Liste des enfants enregistrés - inspiré de la maquette mes_enfants
 */
export const MesEnfantsScreen = () => {
  const navigation = useNavigation<any>();
  const [children, setChildren] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    loadChildren();
  }, []);

  const loadChildren = async () => {
    try {
      const data = await birthService.getRecentBirths();
      setChildren(data);
    } catch (e) {
      console.error('Error loading children:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChild = (record: any) => {
    const child = record.enfant;
    if (!child) return null;

    return (
      <ChildCard
        key={record.id}
        name={`${child.prenoms} ${child.nom}`}
        birthDate={`Né(e) le ${new Date(child.dateNaissance).toLocaleDateString('fr-FR')}`}
        location={child.lieuNaissanceLibelle || 'Non spécifié'}
        id={record.identifiantUniqueNational || 'PROVISOIRE'}
        photoUri={record.attachments?.[0]?.urlFichier || 'https://i.pravatar.cc/150?u=' + record.id}
        onPress={() => navigation.navigate('DigitalProof', { recordId: record.id })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>NaissanceChain</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Mes Enfants</Text>
          <Text style={styles.pageSub}>
            Gérez les registres numériques de naissance de votre famille en toute sécurité.
          </Text>
        </View>

        {/* Children Cards */}
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : children.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40, opacity: 0.5 }}>
            <MaterialIcons name="child-care" size={48} color={Colors.outline} />
            <Text style={{ marginTop: 10, fontWeight: '700' }}>Aucun enfant trouvé</Text>
          </View>
        ) : (
          <>
            {children.map(renderChild)}
            <TouchableOpacity 
              style={styles.linkMoreBtn}
              onPress={() => navigation.navigate('LinkChild')}
            >
              <View style={styles.linkMoreIcon}>
                <MaterialIcons name="add-a-photo" size={24} color={Colors.primary} />
              </View>
              <View style={styles.linkMoreTextWrapper}>
                <Text style={styles.linkMoreTitle}>Un enfant manque à la liste ?</Text>
                <Text style={styles.linkMoreSub}>Scannez l&apos;acte papier pour lier un autre membre de la famille.</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={Colors.outline} />
            </TouchableOpacity>
          </>
        )}

        {/* Info Banner — demande via agent */}
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerIcon}>
            <MaterialIcons name="info" size={24} color={Colors.primary} />
          </View>
          <View style={styles.infoBannerText}>
            <Text style={styles.infoBannerTitle}>Enregistrement via un agent</Text>
            <Text style={styles.infoBannerSub}>
              L&apos;enregistrement d&apos;un nouveau-né doit être effectué par un agent d&apos;état civil agréé ou une sage-femme. Contactez le centre de santé le plus proche.
            </Text>
          </View>
        </View>

        {/* Security Banner */}
        <View style={styles.securityBanner}>
          <MaterialIcons name="security" size={48} color={Colors.primary} style={{ opacity: 0.8 }} />
          <View style={styles.securityText}>
            <Text style={styles.securityTitle}>Sécurité Souveraine</Text>
            <Text style={styles.securitySub}>
              Vos données sont protégées par le protocole d&apos;État NaissanceChain. Chaque acte est horodaté et signé numériquement par les autorités de la République de Guinée.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  pageSub: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  // Child Card
  childCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 28,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  childPhotoWrapper: {
    height: 180,
    backgroundColor: Colors.surfaceContainerHigh,
    position: 'relative',
  },
  childPhoto: {
    width: '100%',
    height: '100%',
  },
  certifiedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  certifiedText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1.5,
  },
  childBody: {
    padding: 20,
  },
  childInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  childName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.onSurface,
    letterSpacing: -0.3,
  },
  childBirthDate: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 14,
  },
  childMeta: {
    gap: 8,
    marginBottom: 18,
  },
  childMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  childMetaText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  viewActeBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  viewActeBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },

  // Info Banner
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: Colors.primary + '10',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '25',
  },
  infoBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBannerText: { flex: 1 },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 5,
  },
  infoBannerSub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },

  // Security Banner
  securityBanner: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  securityText: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.onSurface,
    marginBottom: 6,
  },
  securitySub: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  // Link More Children styles
  linkMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  linkMoreIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  linkMoreTextWrapper: {
    flex: 1,
  },
  linkMoreTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.onSurface,
    marginBottom: 2,
  },
  linkMoreSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 15,
  },
});
